import { Product } from "./types";

export const products: Product[] = [
  {
    id: "moringa-seeds",
    name: "Artisan Moringa Seeds",
    description: "Sourced from our Akosombo groves, these seeds are nature's potent multi-vitamin.",
    longDescription: "Harvested from the lush groves of Akosombo, our artisan moringa seeds are hand-selected for maximum potency. Rich in antioxidants, vitamins A, C, and E, these seeds support immune function, reduce inflammation, and promote healthy digestion. Each batch is sun-dried using traditional methods to preserve their natural enzymatic activity.",
    healthBenefits: [
      "Boosts immune system function",
      "Rich in antioxidants and anti-inflammatory compounds",
      "Supports healthy blood sugar levels",
      "Promotes digestive health and gut flora balance",
      "Natural energy booster without caffeine"
    ],
    category: "Seeds",
    price: 85,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&h=1000&fit=crop",
    inStock: true,
    stockQuantity: 15,
    badge: "Immunity",
    provenance: "Akosombo, Ghana",
    weight: "250g",
    relatedProducts: ["moringa-powder", "baobab-seeds"]
  },
  {
    id: "hibiscus-petals",
    name: "Sun-Dried Hibiscus",
    description: "Hand-picked petals from the northern plains, dried under the Ghanaian sun.",
    longDescription: "Our hibiscus petals are carefully hand-picked from the fertile plains of Northern Ghana and sun-dried to perfection. Known as 'sobolo' in local tradition, this vibrant botanical is packed with anthocyanins that support cardiovascular health, help maintain healthy blood pressure, and provide a refreshing, tangy flavor profile.",
    healthBenefits: [
      "Supports healthy blood pressure levels",
      "Rich in vitamin C for immune support",
      "Promotes healthy cholesterol levels",
      "Natural diuretic properties",
      "Supports liver health and detoxification"
    ],
    category: "Herbal Products",
    price: 65,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&h=1000&fit=crop",
    inStock: true,
    stockQuantity: 8,
    badge: "Circulation",
    provenance: "Northern Ghana",
    weight: "150g",
    relatedProducts: ["turmeric-powder", "neem-leaves"]
  },
  {
    id: "turmeric-powder",
    name: "Ancestral Turmeric",
    description: "Earth-cured and finely milled to preserve its volatile essential oils.",
    longDescription: "Our ancestral turmeric is grown in the rich volcanic soils of the Ashanti region. Each rhizome is earth-cured using traditional methods before being stone-ground into a fine powder. With a curcumin content of over 4%, this golden spice offers powerful anti-inflammatory and antioxidant properties that have been treasured in Ghanaian traditional medicine for centuries.",
    healthBenefits: [
      "Potent anti-inflammatory properties",
      "Supports joint health and mobility",
      "Powerful antioxidant protection",
      "Aids cognitive function and memory",
      "Supports healthy skin complexion"
    ],
    category: "Powders",
    price: 95,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&h=1000&fit=crop",
    inStock: true,
    stockQuantity: 20,
    badge: "Anti-Inflammatory",
    provenance: "Ashanti Region, Ghana",
    weight: "200g",
    relatedProducts: ["ginger-powder", "moringa-powder"]
  },
  {
    id: "baobab-seeds",
    name: "Precious Baobab Seeds",
    description: "Heirloom variety from the ancient baobab trees of the savanna.",
    longDescription: "Harvested from the iconic 'Tree of Life' in Ghana's northern savanna, our baobab seeds carry the wisdom of centuries. These nutrient-dense seeds are exceptionally high in fiber, vitamin C, and essential fatty acids. The baobab fruit's natural prebiotic properties support gut health, while its antioxidant profile helps combat oxidative stress.",
    healthBenefits: [
      "Exceptionally high in vitamin C (6x oranges)",
      "Rich in dietary fiber for digestive health",
      "Natural prebiotic for gut flora support",
      "High antioxidant capacity",
      "Supports healthy blood sugar metabolism"
    ],
    category: "Seeds",
    price: 120,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=1000&fit=crop",
    inStock: false,
    stockQuantity: 0,
    badge: "Vitality",
    provenance: "Northern Savanna, Ghana",
    weight: "300g",
    relatedProducts: ["moringa-seeds", "hibiscus-petals"]
  },
  {
    id: "neem-leaves",
    name: "Sacred Neem Leaves",
    description: "Wild-foraged neem, known as the 'village pharmacy' in traditional medicine.",
    longDescription: "Our neem leaves are wild-foraged from ancient trees in Ghana's coastal regions. Revered as the 'village pharmacy' across West Africa, neem is a cornerstone of traditional medicine. These leaves are rich in nimbin and nimbidin compounds that support immune function, skin health, and natural detoxification processes.",
    healthBenefits: [
      "Supports natural immune response",
      "Promotes clear, healthy skin",
      "Natural blood purifying properties",
      "Supports oral health and hygiene",
      "Aids natural detoxification processes"
    ],
    category: "Herbal Products",
    price: 70,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?w=800&h=1000&fit=crop",
    inStock: true,
    stockQuantity: 5,
    badge: "Detox",
    provenance: "Coastal Ghana",
    weight: "100g",
    relatedProducts: ["moringa-powder", "turmeric-powder"]
  },
  {
    id: "ginger-powder",
    name: "Fiery Ginger Root Powder",
    description: "Sun-dried and stone-ground for maximum gingerol retention.",
    longDescription: "Our ginger powder is crafted from rhizomes grown in the fertile soils of the Eastern Region. Sun-dried and traditionally stone-ground, this powder retains its full gingerol content — the bioactive compound responsible for ginger's powerful anti-inflammatory and digestive benefits. A warming spice that ignites the digestive fire.",
    healthBenefits: [
      "Supports healthy digestion and reduces bloating",
      "Powerful anti-inflammatory and pain relief",
      "Helps alleviate nausea and motion sickness",
      "Supports healthy circulation",
      "Natural thermogenic for metabolism support"
    ],
    category: "Powders",
    price: 75,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&h=1000&fit=crop",
    inStock: true,
    stockQuantity: 12,
    badge: "Digestion",
    provenance: "Eastern Region, Ghana",
    weight: "150g",
    relatedProducts: ["turmeric-powder", "moringa-powder"]
  },
  {
    id: "moringa-powder",
    name: "Moringa Leaf Powder",
    description: "The 'miracle tree' leaves, dried and milled into green gold.",
    longDescription: "Our moringa leaf powder is made from hand-harvested leaves of the 'miracle tree' grown in the Volta Region. Rapidly air-dried in the shade to preserve nutrients, this vibrant green powder is one of nature's most complete plant proteins. It contains all nine essential amino acids and is extraordinarily rich in iron, calcium, and vitamin K.",
    healthBenefits: [
      "Complete plant protein with all essential amino acids",
      "Rich in iron for energy and vitality",
      "Supports healthy lactation for nursing mothers",
      "Promotes bone health with high calcium content",
      "Natural anti-inflammatory for joint comfort"
    ],
    category: "Powders",
    price: 90,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&h=1000&fit=crop",
    inStock: true,
    stockQuantity: 18,
    badge: "Superfood",
    provenance: "Volta Region, Ghana",
    weight: "200g",
    relatedProducts: ["moringa-seeds", "baobab-seeds"]
  },
  {
    id: "black-seed",
    name: "Nigella Sativa (Black Seed)",
    description: "Ancient black seed, known as the remedy for everything but death.",
    longDescription: "Our Nigella Sativa — known locally as 'chimen' and revered across the Islamic and traditional African medical traditions — is sourced from partner farms in northern Ghana. These tiny black seeds contain thymoquinone, a compound with remarkable antioxidant, anti-inflammatory, and immune-modulating properties.",
    healthBenefits: [
      "Supports robust immune system function",
      "Promotes respiratory and lung health",
      "Supports healthy blood sugar regulation",
      "Natural anti-inflammatory for whole-body wellness",
      "Supports healthy skin and hair growth"
    ],
    category: "Seeds",
    price: 110,
    currency: "GHS",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=1000&fit=crop",
    inStock: true,
    stockQuantity: 10,
    badge: "Wellness",
    provenance: "Northern Ghana",
    weight: "250g",
    relatedProducts: ["neem-leaves", "moringa-seeds"]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getRelatedProducts = (product: Product): Product[] => {
  if (!product.relatedProducts) return [];
  return products.filter((p) => product.relatedProducts?.includes(p.id));
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
};
