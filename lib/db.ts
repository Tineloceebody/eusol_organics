import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Product, Order } from '@/lib/types';
import { products as fallbackProducts } from '@/lib/data';

// Storage key for local orders fallback
const LOCAL_ORDERS_KEY = 'eusol_local_orders';

// Helper to get local orders from localStorage (in browser)
function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading local orders:', e);
    return [];
  }
}

// Helper to save local order to localStorage
function saveLocalOrder(order: Order) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving local order:', e);
  }
}

/**
 * Fetch all products (Supabase with static fallback)
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return fallbackProducts;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackProducts;
    }

    return data as Product[];
  } catch (err) {
    console.warn('Supabase fetch products error, using fallback:', err);
    return fallbackProducts;
  }
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const found = fallbackProducts.find((p) => p.id === id);
    return found || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const found = fallbackProducts.find((p) => p.id === id);
      return found || null;
    }

    return data as Product;
  } catch {
    const found = fallbackProducts.find((p) => p.id === id);
    return found || null;
  }
}

/**
 * Create a new product in Supabase or fallback
 */
export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date(),
  };

  // Add to in-memory fallback list so it appears in shop & admin immediately
  const existingIdx = fallbackProducts.findIndex((p) => p.id === newProduct.id);
  if (existingIdx === -1) {
    fallbackProducts.unshift(newProduct);
  }

  if (!isSupabaseConfigured()) {
    return newProduct;
  }

  try {
    const { error } = await supabase.from('products').insert({
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      price: newProduct.price,
      currency: newProduct.currency || 'GHS',
      image: newProduct.image,
      in_stock: newProduct.inStock ?? true,
      stock_quantity: newProduct.stockQuantity ?? 10,
      created_at: (newProduct.createdAt || new Date()).toISOString(),
    });

    if (error) {
      console.warn('Supabase createProduct warning:', error.message);
    }
  } catch (err) {
    console.error('Supabase createProduct error:', err);
  }

  return newProduct;
}

/**
 * Create an order in Supabase & fallback store, and automatically update product stock
 */
export async function createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
  const newOrder: Order = {
    ...order,
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  // Always save locally so customer sees it immediately
  saveLocalOrder(newOrder);

  // Automatically update stock levels for ordered items
  for (const item of newOrder.items) {
    const found = fallbackProducts.find((p) => p.id === item.productId);
    if (found) {
      const currentQty = found.stockQuantity ?? 10;
      const newQty = Math.max(0, currentQty - item.quantity);
      found.stockQuantity = newQty;
      if (newQty <= 0) {
        found.inStock = false;
      }
    }
  }

  if (!isSupabaseConfigured()) {
    return newOrder;
  }

  try {
    const { error: orderError } = await supabase.from('orders').insert({
      id: newOrder.id,
      order_number: newOrder.orderNumber,
      user_id: newOrder.userId || null,
      customer_name: newOrder.customerInfo.fullName,
      phone: newOrder.customerInfo.phone,
      email: newOrder.customerInfo.email,
      address: newOrder.customerInfo.address,
      area: newOrder.customerInfo.area,
      region: newOrder.customerInfo.region,
      landmark: newOrder.customerInfo.landmark || null,
      notes: newOrder.customerInfo.notes || null,
      subtotal: newOrder.subtotal,
      delivery_fee: newOrder.deliveryFee,
      total_amount: newOrder.totalAmount,
      currency: newOrder.currency,
      payment_method: newOrder.paymentMethod,
      payment_status: newOrder.paymentStatus,
      payment_reference: newOrder.paymentReference || null,
      order_status: newOrder.orderStatus,
      created_at: newOrder.createdAt,
    });

    if (orderError) {
      console.warn('Supabase order creation warning:', orderError.message);
    } else {
      // Insert items into order_items table
      const itemsToInsert = newOrder.items.map((item) => ({
        order_id: newOrder.id,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight || null,
        image: item.image,
      }));

      await supabase.from('order_items').insert(itemsToInsert);

      // Decrement stock in Supabase
      for (const item of newOrder.items) {
        const { data: prodData } = await supabase
          .from('products')
          .select('stock_quantity, in_stock')
          .eq('id', item.productId)
          .single();

        if (prodData) {
          const currentQty = prodData.stock_quantity ?? 10;
          const newQty = Math.max(0, currentQty - item.quantity);
          const isStillInStock = newQty > 0;

          await supabase
            .from('products')
            .update({
              stock_quantity: newQty,
              in_stock: isStillInStock,
            })
            .eq('id', item.productId);
        }
      }
    }
  } catch (err) {
    console.error('Supabase createOrder error:', err);
  }

  return newOrder;
}

/**
 * Update stock quantity and inStock status for a product (Admin or System)
 */
export async function updateProductStock(
  productId: string,
  stockQuantity: number,
  inStock?: boolean
): Promise<boolean> {
  const isAvailable = inStock !== undefined ? inStock : stockQuantity > 0;

  const found = fallbackProducts.find((p) => p.id === productId);
  if (found) {
    found.stockQuantity = stockQuantity;
    found.inStock = isAvailable;
  }

  if (!isSupabaseConfigured()) return true;

  try {
    const { error } = await supabase
      .from('products')
      .update({
        stock_quantity: stockQuantity,
        in_stock: isAvailable,
      })
      .eq('id', productId);

    if (error) {
      console.warn('Supabase updateProductStock warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('updateProductStock error:', err);
    return false;
  }
}

/**
 * Update an existing product (Name, Description, Category, Price, StockQuantity, Image, Media)
 */
export async function updateProduct(
  productId: string,
  updates: Partial<Product>
): Promise<boolean> {
  const index = fallbackProducts.findIndex((p) => p.id === productId);
  if (index !== -1) {
    const nextStock = updates.stockQuantity !== undefined ? updates.stockQuantity : fallbackProducts[index].stockQuantity;
    fallbackProducts[index] = {
      ...fallbackProducts[index],
      ...updates,
      inStock: nextStock !== undefined ? nextStock > 0 : (updates.inStock ?? fallbackProducts[index].inStock),
    };
  }

  if (!isSupabaseConfigured()) return true;

  try {
    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.longDescription !== undefined) payload.long_description = updates.longDescription;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.image !== undefined) payload.image = updates.image;
    if (updates.stockQuantity !== undefined) {
      payload.stock_quantity = updates.stockQuantity;
      payload.in_stock = updates.stockQuantity > 0;
    }
    if (updates.media !== undefined) payload.media = updates.media;

    const { error } = await supabase.from('products').update(payload).eq('id', productId);
    if (error) console.warn('Supabase updateProduct warning:', error.message);
    return true;
  } catch (err) {
    console.error('updateProduct error:', err);
    return false;
  }
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(productId: string): Promise<boolean> {
  const index = fallbackProducts.findIndex((p) => p.id === productId);
  if (index !== -1) {
    fallbackProducts.splice(index, 1);
  }

  if (!isSupabaseConfigured()) return true;

  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) console.warn('Supabase deleteProduct warning:', error.message);
    return true;
  } catch (err) {
    console.error('deleteProduct error:', err);
    return false;
  }
}

/**
 * Delete a media item (image/video) from a product
 */
export async function deleteProductMedia(
  productId: string,
  mediaId: string
): Promise<boolean> {
  const product = fallbackProducts.find((p) => p.id === productId);
  if (product && product.media) {
    product.media = product.media.filter((m) => m.id !== mediaId);
  }

  if (!isSupabaseConfigured()) return true;

  try {
    if (product && product.media) {
      await supabase.from('products').update({ media: product.media }).eq('id', productId);
    }
    return true;
  } catch (err) {
    console.error('deleteProductMedia error:', err);
    return false;
  }
}

/**
 * Get single order by ID or orderNumber
 */
export async function getOrderById(idOrNumber: string): Promise<Order | null> {
  // Check local storage first
  const localOrders = getLocalOrders();
  const localFound = localOrders.find(
    (o) => o.id === idOrNumber || o.orderNumber.toLowerCase() === idOrNumber.toLowerCase()
  );

  if (localFound) return localFound;

  if (!isSupabaseConfigured()) return null;

  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .or(`id.eq.${idOrNumber},order_number.eq.${idOrNumber}`)
      .single();

    if (orderError || !orderData) return null;

    const { data: itemsData } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderData.id);

    const order: Order = {
      id: orderData.id,
      orderNumber: orderData.order_number,
      userId: orderData.user_id,
      customerInfo: {
        fullName: orderData.customer_name,
        phone: orderData.phone,
        email: orderData.email,
        region: 'Greater Accra',
        area: orderData.area,
        address: orderData.address,
        landmark: orderData.landmark,
        notes: orderData.notes,
      },
      items: (itemsData || []).map((it: Record<string, unknown>) => ({
        id: String(it.id),
        productId: String(it.product_id),
        name: String(it.name),
        price: Number(it.price),
        quantity: Number(it.quantity),
        weight: String(it.weight || ''),
        image: String(it.image),
      })),
      subtotal: Number(orderData.subtotal),
      deliveryFee: Number(orderData.delivery_fee),
      totalAmount: Number(orderData.total_amount),
      currency: orderData.currency || 'GHS',
      paymentMethod: orderData.payment_method,
      paymentStatus: orderData.payment_status,
      paymentReference: orderData.payment_reference,
      orderStatus: orderData.order_status,
      createdAt: orderData.created_at,
    };

    return order;
  } catch (err) {
    console.error('Error fetching order from Supabase:', err);
    return null;
  }
}

/**
 * Get all orders for a specific logged-in user
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const localOrders = getLocalOrders().filter((o) => o.userId === userId);

  if (!isSupabaseConfigured()) return localOrders;

  try {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !ordersData) return localOrders;

    const fullOrders: Order[] = await Promise.all(
      ordersData.map(async (od) => {
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', od.id);

        return {
          id: od.id,
          orderNumber: od.order_number,
          userId: od.user_id,
          customerInfo: {
            fullName: od.customer_name,
            phone: od.phone,
            email: od.email,
            region: 'Greater Accra',
            area: od.area,
            address: od.address,
            landmark: od.landmark,
            notes: od.notes,
          },
          items: (itemsData || []).map((it: Record<string, unknown>) => ({
            id: String(it.id),
            productId: String(it.product_id),
            name: String(it.name),
            price: Number(it.price),
            quantity: Number(it.quantity),
            weight: String(it.weight || ''),
            image: String(it.image),
          })),
          subtotal: Number(od.subtotal),
          deliveryFee: Number(od.delivery_fee),
          totalAmount: Number(od.total_amount),
          currency: od.currency || 'GHS',
          paymentMethod: od.payment_method,
          paymentStatus: od.payment_status,
          paymentReference: od.payment_reference,
          orderStatus: od.order_status,
          createdAt: od.created_at,
        };
      })
    );

    return fullOrders.length > 0 ? fullOrders : localOrders;
  } catch (err) {
    console.error('Error fetching user orders:', err);
    return localOrders;
  }
}

/**
 * Update order status (Admin function)
 */
export async function updateOrderStatus(
  orderId: string,
  orderStatus: Order['orderStatus'],
  paymentStatus?: Order['paymentStatus']
) {
  // Update local storage
  const localOrders = getLocalOrders();
  const updatedLocal = localOrders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        orderStatus,
        paymentStatus: paymentStatus || o.paymentStatus,
        updatedAt: new Date().toISOString(),
      };
    }
    return o;
  });
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updatedLocal));

  if (!isSupabaseConfigured()) return true;

  try {
    const updatePayload: Record<string, unknown> = {
      order_status: orderStatus,
      updated_at: new Date().toISOString(),
    };
    if (paymentStatus) {
      updatePayload.payment_status = paymentStatus;
    }

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (error) {
      console.error('Supabase update order status error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Update order status error:', err);
    return false;
  }
}
