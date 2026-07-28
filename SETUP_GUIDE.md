# EUSOL Organics - Day 1 Setup Guide

## Step 1: Install Dependencies

```bash
cd c:\Users\Rich Ali\Desktop\DEVELOPMENTS\EUSOL Organics\my-app
npm install
```

This will install:
- Firebase v10.7.0 (Authentication, Firestore, Storage)
- react-dropzone v14.2.3 (for drag-and-drop file uploads)
- All existing dependencies

## Step 2: Configure Firebase

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create Project" or select an existing one
   - Name it "EUSOL Organics"

2. **Enable Services:**
   - In Firebase Console, enable:
     - ✅ Authentication (Email/Password)
     - ✅ Firestore Database
     - ✅ Storage

3. **Get Your Configuration:**
   - Go to Project Settings (⚙️ icon) → General tab
   - Scroll down to "Your apps" section
   - Click on the Web app (or create one with "Add app")
   - Copy the entire configuration

4. **Set Environment Variables:**
   - Copy `.env.local.example` to `.env.local`
   - Paste your Firebase config values:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxxxxxxxx
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eusol-organics.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=eusol-organics
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eusol-organics.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
     NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxx
     ```

## Step 3: Set Up Firebase Authentication

1. **Create Admin User in Firebase:**
   - Go to Firebase Console → Authentication → Users
   - Click "Add user" or use the "Create user" button
   - Enter your admin email and password
   - Example: `admin@eusol.com` / `SecurePassword123!`

2. **Add Sample Products to Firestore:**
   - Go to Firebase Console → Firestore Database
   - Create a new collection called `products`
   - Add a document with this structure:
     ```json
     {
       "name": "Artisan Moringa Seeds",
       "description": "Sourced from Akosombo groves",
       "category": "Seeds",
       "price": 85,
       "currency": "GHS",
       "image": "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&h=1000&fit=crop",
       "inStock": true,
       "healthBenefits": ["Boosts immune system", "Rich in antioxidants"]
     }
     ```

## Step 4: Run the Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

## Step 5: Test the Admin Panel

1. **Navigate to Admin:**
   - Go to `http://localhost:3000/admin/login`
   - Login with your Firebase admin credentials (e.g., `admin@eusol.com`)

2. **Upload Media:**
   - Select a product from the sidebar
   - Choose Image or Video
   - Drag and drop or click to upload
   - Media will be stored in Firebase Storage
   - Metadata saved to Firestore

3. **View Storefront:**
   - Go to `http://localhost:3000`
   - Browse products (currently showing from data.ts)
   - Products will load from Firestore once integrated

## Project Structure Created

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          ← Admin login page
│   └── dashboard/
│       └── page.tsx          ← Admin media upload dashboard
├── layout.tsx                ← Updated with AdminProvider
└── providers.tsx             ← Updated with AdminProvider

lib/
├── firebase.ts               ← Firebase initialization & exports
├── admin-context.tsx         ← Admin auth context & hooks
└── types.ts                  ← ProductMedia & Product interfaces

.env.local.example            ← Environment variable template
```

## Key Features Implemented

✅ **Firebase Setup**
- Authentication (Email/Password)
- Firestore Database
- Storage for media files

✅ **Admin Panel**
- Login page with Firebase Auth
- Protected admin dashboard
- Image & video upload with dropzone
- Media metadata storage in Firestore

✅ **TypeScript Interfaces**
- ProductMedia (id, type, url, altText, isPrimary, uploadedAt, fileName)
- Product (with media array support)

✅ **Styling**
- Earthy color palette (primary, secondary, tertiary)
- Tailwind CSS with custom colors
- Responsive design

## Next Steps for Day 2

1. Integrate Firestore products into storefront
2. Create product detail page with video playback
3. Add shopping cart functionality
4. Implement product filtering by category
5. Create checkout flow
6. Add order management to admin panel

## Troubleshooting

**"Firebase initialization error"**
- Ensure `.env.local` has correct Firebase credentials
- Check that `NEXT_PUBLIC_` prefix is used for all public env vars

**"Login failed"**
- Verify user exists in Firebase Authentication
- Check email/password are correct
- Ensure Authentication is enabled in Firebase Console

**"Upload failed"**
- Verify Storage bucket is enabled
- Check that the product exists in Firestore
- Ensure file size is reasonable (< 100MB recommended)

## Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linting
npm run lint

# Install new package
npm install package-name
```

---
**Project:** EUSOL Organics MVP
**Tech Stack:** Next.js 14 | React 18 | TypeScript | Tailwind CSS | Firebase
**Last Updated:** May 21, 2026
