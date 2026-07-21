# Couplo Admin

Admin dashboard for **Couplo Baby Sets** — React + TypeScript + Tailwind CSS, built as a standalone project.

## Getting started

```bash
npm install
npm run dev
```

Visit the printed local URL. You'll land on `/login` — any email + a password of 6+ characters signs you in (this is a stub, see below).

## Pages

- `/login` — admin sign in
- `/` — dashboard overview (stats, recent orders, quick actions, top products)
- `/products` — product inventory, search + category filter, add-product modal
- `/orders` — orders table, search + status filter
- `/customers` — customer directory
- `/settings` — store info, account, notifications, checkout toggles

## Wiring up the real backend

All data currently comes from `src/data/mockData.ts` and auth from a stub in
`src/context/AuthContext.tsx`. Search the codebase for `TODO(backend)` to find
every spot that should be swapped for a real API call to your Express/MongoDB
backend, e.g.:

- `src/context/AuthContext.tsx` → `loginRequest()` — replace with `POST /api/admin/auth/login`
- `src/pages/ProductsPage.tsx` → `AddProductModal.handleSubmit` — replace with `POST /api/products`
- `src/data/mockData.ts` — replace with `fetch`/`react-query` calls to your orders/customers/products endpoints

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (custom `mauve`/`blush`/`cream` palette matching the Couplo brand)
- react-router-dom
- lucide-react icons
