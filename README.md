# Shopora — Luxury Home & Living E-Commerce Platform

<div align="center">

![Next.js 16](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma ORM](https://img.shields.io/badge/Prisma_6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black)
![Razorpay](https://img.shields.io/badge/Razorpay_Payments-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)

**A modern, production-grade luxury e-commerce platform crafted for furniture and interior living.**  
Featuring high-performance SSR/ISR, interactive room lookbooks, serverless media pipelines, real-time Razorpay payments, and an executive administration dashboard.

[Explore Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-getting-started) • [Architecture](#-project-structure) • [Admin Suite](#-admin-dashboard)

</div>

---

## 🌟 Overview

**Shopora** is designed to provide an artisanal shopping experience inspired by world-class Scandinavian and contemporary Indian furniture brands. Every interaction is optimized for speed, aesthetic warmth, and high conversion — from the Framer Motion hero experience to instant serverless image uploads and seamless checkout.

---

## ✨ Key Features

### 🛍️ Customer Storefront Experience

- **10-Section Curated Luxury Homepage**:
  1. **Framer Motion Hero Carousel**: Auto-sliding luxury lifestyle transitions with touch swipe support, manual direction control, and progress indicators.
  2. **Value Pillars Marquee**: Solid wood guarantee, free delivery over ₹999, 2-year warranty, and 30-day hassle-free returns.
  3. **Department Showcase**: Visual grid for Seating, Tables, Bedroom, Storage, and Decor.
  4. **Curated Bestsellers Grid**: 5-column layout with corner badges, star ratings, review counts, and floating quick-add-to-cart buttons.
  5. **Festive Deals & Ad Banners**: Seasonal promotional banners with countdown timers and one-click copyable coupon codes (`DEEP26`).
  6. **Interactive Lookbook ("Shop The Look")**: Living room scene with clickable interactive product hotspot pins that trigger live product drawer modals.
  7. **Under ₹4,999 Accent Finds**: Budget-conscious luxury decor picks.
  8. **Verified Community Reviews**: Customer testimonials wall with verified buyer badges.
  9. **Artisanal Craftsmanship Story**: Brand heritage, sustainable timber sourcing, and joinery details.
  10. **VIP Design Club Newsletter**: Coupon voucher subscription banner.

- **Intelligent Navigation & Header**:
  - Rotating announcement bar highlighting seasonal sales and delivery notices.
  - Headroom-style auto-hiding navbar (hides on scroll down, reveals on scroll up).
  - Dynamic live wishlist and cart quantity counters.
  - Desktop Mega Menu with visual department previews.
  - Dedicated, isolated storefront routes:
    - **Shop** (`/products`): Full catalog with category filtering and multi-attribute sorting.
    - **New Arrivals** (`/new-arrivals`): Fresh drops and seasonal collections.
    - **Categories** (`/categories`): Visual department directory.
    - **Exclusive Offers** (`/offers`): Festive sale items with discount badges and vouchers.
  - Responsive mobile drawer navigation with category deep-linking.
  - Elegant Dark Walnut luxury footer (`#291a0c`) with contact details, social badges, and policy links.

- **Product Detail Pages (`/product/[slug]`)**:
  - Interactive gallery with thumbnails and smooth zoom modal.
  - Live inventory tracking and comparison pricing (e.g., *₹5,500* ~~₹7,200~~ `24% OFF`).
  - **Dynamic Specifications Table**: Auto-renders markdown and key-value specs into styled specification tables (Item Code, Materials, Dimensions, Hardware, Warranty).
  - Interactive accordions for Description, Dimensions, and Shipping & Returns.
  - Customer review submission and approval-gated rating wall.
  - "You might also like" automated category recommendations.

- **Cart, Checkout & Payments**:
  - Persistent shopping cart backed by local storage and database sync.
  - Multi-step checkout with address validation and billing details.
  - **Razorpay Integration**: Instant UPI, Credit/Debit cards, Net Banking, and Wallets with cryptographic webhook verification.
  - Cash on Delivery (COD) support.
  - Dynamic downloadable invoices and real-time order tracking (`/orders/[id]`).

- **Authentication & User Accounts**:
  - Powered by **NextAuth v5 (Beta)** with JWT session strategy.
  - Email/Password login with bcrypt salt hashing.
  - One-click Google OAuth sign-in.
  - Password reset pipeline with secure token dispatch via Resend/Nodemailer.
  - User profile with order history and personal wishlist management.

---

### 🛡️ Admin Dashboard Suite (`/admin`)

- **Executive Analytics Overview**:
  - Real-time revenue, order volume, catalog size, and customer counts.
  - Recharts visual graphs: Monthly Revenue Trends, Category Distribution, and Order Status breakdowns.
  - Low-stock inventory alert banners.
- **Product Management**:
  - Full CRUD operations with category mapping and variant configuration (sizes, colors).
  - **1-Click Specification Generator**: Built-in toolbar button to insert standardized specification tables and bullet points with instant live preview.
  - **Serverless Media Pipeline**: Database-backed Neon PostgreSQL binary image storage (`/api/upload` & `/api/uploads/[id]`) with Cloudinary fallback, fully compatible with Vercel serverless functions.
- **Order Pipeline Operations**:
  - Comprehensive order table with status progression: `PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED` ➔ `CANCELLED`.
  - Detailed modal inspection of customer shipping address, payment method, and itemized receipts.
  - CSV export for fulfillment logistics.
- **Customer & Review Moderation**:
  - Customer review moderation queue (Approve / Reject reviews before public display).
  - Subscriber mailing list management with campaign broadcast triggers.
  - Contact form message inbox.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, Server Actions) |
| **UI Library** | React 19, Tailwind CSS v4, Radix UI primitives |
| **Motion & Animation** | Framer Motion |
| **Icons & Design** | Lucide React |
| **State Management** | Zustand (persistent cart store) |
| **Database & ORM** | PostgreSQL (Neon Serverless), Prisma ORM 6 |
| **Authentication** | NextAuth.js v5 (Beta), bcryptjs |
| **Payments** | Razorpay Node.js SDK & Webhooks |
| **Email Service** | Resend API & Nodemailer |
| **Forms & Validation** | React Hook Form, Zod v4 |
| **Notifications** | Sonner (Toast notifications) |
| **Charts** | Recharts |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **npm** or **pnpm** / **yarn**
- A **PostgreSQL** database (e.g., [Neon](https://neon.tech), Supabase, or a local Postgres instance)

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/shopora.git
   cd shopora
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Key environment variables required:
   ```env
   # Database (Neon PostgreSQL)
   DATABASE_URL="postgresql://username:password@ep-host.us-east-1.aws.neon.tech/neondb?sslmode=require"

   # Auth & Security
   AUTH_SECRET="your_32_character_random_auth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Google OAuth (Optional for social login)
   GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"

   # Razorpay (Online Payments)
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_key_id"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

   # Resend Email (Order confirmations & Password reset)
   RESEND_API_KEY="re_your_api_key"
   EMAIL_FROM="Shopora <orders@yourdomain.com>"
   ```

4. **Synchronize Database Schema**:
   Push the Prisma schema to your PostgreSQL database:
   ```bash
   npx prisma db push
   ```

5. **Seed Initial Products & Categories**:
   Populate your store with curated furniture categories, 20+ luxury products, and reviews:
   ```bash
   npm run seed
   ```

6. **Create an Admin Account**:
   Generate an initial administrator user:
   ```bash
   npm run create-admin
   ```

7. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

---

## 📁 Project Structure

```text
shopora/
├── prisma/
│   ├── schema.prisma             # Database schema (User, Product, Order, Review, etc.)
│   ├── seed.ts                   # Initial catalog and category seed script
│   └── create-admin.ts           # Admin user generator script
├── public/
│   ├── images/                   # High-res brand logos and fallback icons
│   └── favicon.ico
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (shop)/               # Storefront Route Group (shares Navbar & Footer)
│   │   │   ├── page.tsx          # 10-Section Luxury Homepage
│   │   │   ├── products/         # Main Catalog with filters and sorting
│   │   │   ├── new-arrivals/     # Dedicated New Arrivals Page
│   │   │   ├── categories/       # Department Showcase
│   │   │   ├── offers/           # Exclusive Festive Sale & Discounts
│   │   │   ├── product/[slug]/   # Dynamic Product Details with Spec Tables
│   │   │   ├── cart/             # Shopping Cart Page
│   │   │   ├── checkout/         # Order Checkout & Razorpay Gateway
│   │   │   ├── login/            # Minimalist Luxury Sign In Page
│   │   │   ├── register/         # Customer Registration Page
│   │   │   └── forgot-password/  # Password Recovery Pipeline
│   │   ├── admin/                # Administrator Dashboard & Management Suite
│   │   │   ├── page.tsx          # Analytics KPI Dashboard
│   │   │   ├── products/         # Product CRUD & Spec Table Generator
│   │   │   ├── orders/           # Order Pipeline & Shipping Manager
│   │   │   ├── reviews/          # Review Moderation Queue
│   │   │   └── subscribers/      # Marketing Newsletter Audience
│   │   └── api/                  # Serverless API Endpoints
│   │       ├── auth/             # NextAuth handler & Password Reset API
│   │       ├── upload/           # Serverless Image Upload Handler
│   │       ├── uploads/[id]/     # High-speed Cached Image Delivery
│   │       └── webhooks/razorpay # Payment Verification Webhook
│   ├── components/               # Modular Component Architecture
│   │   ├── home/                 # HeroSlider, Lookbook, FlashDeals, Features
│   │   ├── layout/               # Navbar, Footer, MegaMenu, MobileNav
│   │   ├── product/              # ProductCard, Spec Table, Gallery, Reviews
│   │   └── ui/                   # Design System Primitives (buttons, dialogs, inputs)
│   ├── lib/                      # Core Utilities & Configurations
│   │   ├── auth.ts               # NextAuth setup and authorize callbacks
│   │   ├── db.ts                 # Prisma Client Singleton
│   │   ├── store.ts              # Zustand Cart & Wishlist Store
│   │   └── utils.ts              # Styling & format helpers
│   └── middleware.ts             # Route Protection & Role-based Redirection
└── package.json
```

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js development server with Turbopack |
| `npm run build` | Compiles and builds the application for production |
| `npm run start` | Boots the compiled production server |
| `npm run db:push` | Pushes the Prisma schema state directly to PostgreSQL |
| `npm run db:studio` | Launches Prisma Studio GUI for exploring database records |
| `npm run seed` | Seeds initial furniture departments, products, and reviews |
| `npm run create-admin` | Creates an administrator account for dashboard access |
| `npm run lint` | Runs ESLint to check for code quality and syntax errors |

---

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub / GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Add all production environment variables from `.env.example` in **Settings > Environment Variables**:
   - Ensure `DATABASE_URL` uses a pooled Neon connection string (e.g., `?sslmode=require`).
   - Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://shopora.com`).
4. Set the Build Command to `npm run build`.
5. Deploy! Vercel will automatically run `prisma generate` during `postinstall` and compile the app.

---

## 🔒 Security Best Practices

- **Role-Based Access Control**: Sensitive routes (`/admin/*`) are strictly protected via NextAuth session verification.
- **Cryptographic Payments**: Razorpay payments are validated using HMAC-SHA256 signature verification before any order is marked as paid.
- **Password Protection**: User passwords are encrypted with `bcryptjs` using a salt work factor of 10.
- **Serverless Resilience**: Image uploads are stored directly in PostgreSQL with 1-year immutable caching (`max-age=31536000`), preventing read-only filesystem errors (`ENOENT: /var/task`) common in serverless environments.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">

Crafted with care for **Shopora Home & Living**.  
*Thoughtfully designed pieces that balance form and function.*

</div>
