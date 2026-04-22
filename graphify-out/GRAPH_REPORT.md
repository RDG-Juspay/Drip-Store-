# Graph Report - .  (2026-04-21)

## Corpus Check
- Corpus is ~4,467 words - fits in a single context window. You may not need a graph.

## Summary
- 45 nodes · 42 edges · 21 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Product Display|Product Display]]
- [[_COMMUNITY_Cart & Checkout UI|Cart & Checkout UI]]
- [[_COMMUNITY_Config & Docs|Config & Docs]]
- [[_COMMUNITY_App Layout & Footer|App Layout & Footer]]
- [[_COMMUNITY_Checkout Logic|Checkout Logic]]
- [[_COMMUNITY_Product Detail Logic|Product Detail Logic]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_TypeScript Env|TypeScript Env]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Products Listing Page|Products Listing Page]]
- [[_COMMUNITY_Navbar Component|Navbar Component]]
- [[_COMMUNITY_Cart Sidebar Component|Cart Sidebar Component]]
- [[_COMMUNITY_Product Data|Product Data]]
- [[_COMMUNITY_Cart Store|Cart Store]]
- [[_COMMUNITY_PostCSS Plugin|PostCSS Plugin]]
- [[_COMMUNITY_Next.js Type Defs|Next.js Type Defs]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Next.js Logo Asset|Next.js Logo Asset]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_Window Icon Asset|Window Icon Asset]]

## God Nodes (most connected - your core abstractions)
1. `useCartStore` - 7 edges
2. `ProductDetailPage` - 6 edges
3. `CartStore` - 6 edges
4. `ProductCard()` - 5 edges
5. `ProductsContent` - 5 edges
6. `Product` - 5 edges
7. `RootLayout()` - 4 edges
8. `CheckoutPage` - 4 edges
9. `CartSidebar` - 4 edges
10. `products array` - 4 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `Navbar`  [EXTRACTED]
  app/layout.tsx → components/Navbar.tsx
- `RootLayout()` --calls--> `CartSidebar`  [EXTRACTED]
  app/layout.tsx → components/CartSidebar.tsx
- `ProductsContent` --references--> `categories array`  [EXTRACTED]
  app/products/page.tsx → lib/products.ts
- `ProductDetailPage` --calls--> `useCartStore`  [EXTRACTED]
  app/products/[id]/page.tsx → lib/store.ts
- `ProductDetailPage` --calls--> `CartStore`  [EXTRACTED]
  app/products/[id]/page.tsx → lib/store.ts

## Hyperedges (group relationships)
- **Components consuming useCartStore global cart state** — navbar_navbar, cartsidebar_cartsidebar, id_page_productdetailpage, checkout_page_checkoutpage [EXTRACTED 1.00]
- **Pages and components consuming lib/products data** — page_homepage, products_page_productscontent, id_page_productdetailpage, productcard_productcard [EXTRACTED 1.00]
- **Root layout shell: Navbar + CartSidebar + Footer wrap all pages** — layout_rootlayout, navbar_navbar, cartsidebar_cartsidebar, footer_footer [EXTRACTED 1.00]
- **User browsing flow: HomePage -> ProductsPage -> ProductDetailPage -> Checkout** — page_homepage, products_page_productspage, id_page_productdetailpage, checkout_page_checkoutpage [INFERRED 0.85]

## Communities

### Community 0 - "Product Display"
Cohesion: 0.39
Nodes (8): ProductDetailPage, HomePage, ProductCard(), categories array, ProductsContent, ProductsPage, Product, products array

### Community 1 - "Cart & Checkout UI"
Cohesion: 0.52
Nodes (7): CartSidebar, CheckoutPage, FormData, Navbar, CartItem, CartStore, useCartStore

### Community 2 - "Config & Docs"
Cohesion: 0.5
Nodes (4): Next.js agent rules (breaking changes warning), graphify knowledge graph usage rules, Vercel logo SVG, Next.js project setup

### Community 3 - "App Layout & Footer"
Cohesion: 0.5
Nodes (2): Footer(), RootLayout()

### Community 4 - "Checkout Logic"
Cohesion: 0.67
Nodes (0): 

### Community 5 - "Product Detail Logic"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Next.js Config"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "TypeScript Env"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Home Page"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Products Listing Page"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Navbar Component"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Cart Sidebar Component"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Product Data"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Cart Store"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "PostCSS Plugin"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Next.js Type Defs"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "File Icon Asset"
Cohesion: 1.0
Nodes (1): file icon SVG

### Community 18 - "Next.js Logo Asset"
Cohesion: 1.0
Nodes (1): Next.js wordmark SVG

### Community 19 - "Globe Icon Asset"
Cohesion: 1.0
Nodes (1): globe/web icon SVG

### Community 20 - "Window Icon Asset"
Cohesion: 1.0
Nodes (1): browser window icon SVG

## Knowledge Gaps
- **8 isolated node(s):** `FormData`, `categories array`, `graphify knowledge graph usage rules`, `file icon SVG`, `Vercel logo SVG` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Product Detail Logic`** (2 nodes): `page.tsx`, `handleAddToCart()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (1 nodes): `next.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TypeScript Env`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Products Listing Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navbar Component`** (1 nodes): `Navbar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart Sidebar Component`** (1 nodes): `CartSidebar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Data`** (1 nodes): `products.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart Store`** (1 nodes): `store.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Plugin`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Type Defs`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Icon Asset`** (1 nodes): `file icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Logo Asset`** (1 nodes): `Next.js wordmark SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Globe Icon Asset`** (1 nodes): `globe/web icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Window Icon Asset`** (1 nodes): `browser window icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProductDetailPage` connect `Product Display` to `Cart & Checkout UI`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `useCartStore` connect `Cart & Checkout UI` to `Product Display`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `RootLayout()` connect `App Layout & Footer` to `Cart & Checkout UI`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useCartStore` (e.g. with `Product` and `CartItem`) actually correct?**
  _`useCartStore` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `FormData`, `categories array`, `graphify knowledge graph usage rules` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._