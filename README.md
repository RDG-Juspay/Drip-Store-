# Drip Store

A modern fashion e-commerce storefront built with Next.js, Tailwind CSS, and Juspay HyperCheckout.

## Live Demo

**[https://drip-store-beige.vercel.app](https://drip-store-beige.vercel.app)**

## Mobile App

Download the Android app:
**[Drip Store v1.0.0 APK](https://github.com/RDG-Juspay/Drip-Store-Flutter-App/releases/download/v1.0.0/drip-store-v1.0.0.apk)**

## Features

- Browse Men, Women, and Unisex collections
- Add to cart with size and color selection
- Checkout with Juspay HyperCheckout (web redirection flow)
- Payment status page (success / pending / failed)
- Fully responsive — mobile first

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Styling** — Tailwind CSS v3
- **State** — Zustand (cart persistence via localStorage)
- **Payments** — Juspay HyperCheckout
- **Hosting** — Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```env
JUSPAY_API_KEY=your_api_key
JUSPAY_MERCHANT_ID=your_merchant_id
JUSPAY_CLIENT_ID=your_client_id
JUSPAY_BASE_URL=https://sandbox.juspay.in
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running Tests

```bash
npm test
```
