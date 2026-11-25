# ShopEase

E-commerce app for the React training assignment.
React 18, Vite, React Router 6, Tailwind CSS 4. Product data comes from the
[DummyJSON](https://dummyjson.com/docs/products) API. Login, roles and the admin
panel are all local (no auth API).

## Run it

```bash
npm install
npm run dev
```

`npm run build` makes a production build.

## Demo credentials

| Role  | Email            | Password    |
| ----- | ---------------- | ----------- |
| Admin | admin@store.com  | Admin@123   |
| User  | user@store.com   | User@123    |

They are defined in `src/data/users.js`. The login page also lists them with a
"Fill" button. To add more test accounts, add another object to `DEMO_USERS`.

## What each role can do

| | Guest | User | Admin |
| --- | :-: | :-: | :-: |
| Browse products, see discounts | yes | yes | yes |
| Wishlist and cart | yes | yes | yes |
| Checkout and place order | no (sent to /login) | yes | yes |
| `/admin` and the Admin Panel link | no | no | yes |

## Folder structure

```
src/
  api/          fetch calls to DummyJSON
  components/   Button, Input, Modal, ConfirmModal, Loader, ErrorMessage, EmptyState,
                Alert, Badge, PriceTag, ProductCard, CartItem, Navbar,
                ProtectedRoute, RequireCart ...
    admin/      AddProductForm, AdminProductRow, EditProductModal, StatCard
  context/      AuthContext, ProductsContext, CartContext, WishlistContext
  data/         demo users
  hooks/        useAuth, useProducts, useCart, useWishlist, useLocalStorage,
                useFetchProducts, useWishlistProducts
  pages/        one file per route, all lazy loaded
  reducers/     cartReducer
  utils/        formatting, catalog helpers, validation
```

## Routes

| Path             | Access                                      |
| ---------------- | ------------------------------------------- |
| `/`              | public                                      |
| `/products/:id`  | public (hidden products: admin only)        |
| `/wishlist`      | public                                      |
| `/cart`          | public                                      |
| `/login`         | public (logged in users are redirected)     |
| `/checkout`      | cart must have items, then login required   |
| `/order-success` | needs an order (redirects home otherwise)   |
| `/admin`         | admin role only                             |
| `*`              | 404 page                                    |

## How role protection works

1. `AuthContext` keeps the session in localStorage via `useLocalStorage`.
   Only the **user id** is stored. On every load the user and role are looked up
   again in `DEMO_USERS`, so editing the role in DevTools does nothing.
2. `<ProtectedRoute allowedRoles={['admin']}>` wraps `/admin` in `App.jsx`.
   - not logged in: redirect to `/login`, remembering where they were going
   - wrong role: "Access denied" screen
   - allowed: renders the page
3. The UI follows the same rules: the Navbar shows Login or the user name,
   role badge and Logout, and the Admin Panel link only exists when `isAdmin`.
4. After login the user goes back to the page they wanted, or to `/admin` for
   admins and `/` for users.

This is a front-end demo. A real app must check roles on the server too, because
anything in the browser can be changed by the user.

## How catalog and discount changes stay in sync

`ProductsContext` is the single source of truth. It merges three things:

1. products from the API (never modified)
2. products the admin created (`localStorage`: `shopease-custom-products`)
3. the admin's changes per product: discount, stock, hidden, removed
   (`localStorage`: `shopease-product-overrides`)

The merged list is built with `useMemo`. Because every page reads it through
`useProducts()`, one admin action updates the store, product details, wishlist
and admin list at once, and `useLocalStorage` makes it survive a refresh.

- **Wishlist** stores only product ids and looks the products up in the catalog,
  so its prices are always live.
- **Cart** keeps the discounted price on each line (`price`) and the original
  (`originalPrice`). A `SYNC_WITH_CATALOG` reducer action runs whenever the
  catalog changes: it updates prices, clamps quantity to stock and removes items
  that are now hidden, removed or out of stock. It only runs once the API data
  has really loaded, so a failed request can't empty the cart.
- Cart totals use the discounted price.
- DummyJSON sends its own discount values. They are ignored so the admin is in
  control, and a few demo discounts are seeded (`SEED_OVERRIDES`).
  "Reset demo data" in the admin panel restores the starting state.

## Admin Panel (`/admin`)

- **Add product**: name, price, category, discount (0-90%), stock, description and
  image URL (optional, a generated placeholder is used otherwise). All fields are
  validated with inline messages.
- **Discounts**: Edit button on every product to add, change or remove a
  discount. Cards, details, cart and admin list show original price, discounted
  price and a badge.
- **Catalog controls**: Hide/Show (visibility), Remove/Restore (soft delete,
  with confirmation), and stock editing (0 = out of stock). Search and status
  filters, plus stat cards.
- Feedback comes from `Alert` banners and `ErrorMessage` (with retry) if the
  catalog fails to load.

## State management

| State | Where |
| --- | --- |
| user, role, session | `AuthContext` + `useAuth()` |
| catalog and admin actions | `ProductsContext` + `useProducts()` |
| cart | `useReducer` in `CartContext` + `useCart()` |
| wishlist ids | `WishlistContext` + `useWishlist()` |
| search, filters, form values, modals | local `useState` in the component that owns it |

Provider order in `main.jsx` matters: `Auth > Products > Cart > Wishlist`,
because the cart reads the catalog.

## Custom hooks

| Hook | Purpose |
| --- | --- |
| `useAuth()` | context access: `user, isAuthenticated, isAdmin, login, logout` |
| `useProducts()` | context access: merged catalog + admin actions |
| `useCart()` / `useWishlist()` | context access |
| `useLocalStorage(key, initial)` | `useState` that persists to localStorage |
| `useFetchProducts()` | API call with loading, error and retry |
| `useWishlistProducts()` | wishlist ids turned into live visible products |

## Optimization decisions

| What | Where | Why |
| --- | --- | --- |
| `useMemo` merged catalog + store list | `ProductsContext` | rebuilt only when API data, custom products or overrides change |
| `useMemo` filtered/sorted list | `ProductListPage`, `AdminPage` | pages also re-render for cart, wishlist and notice changes |
| `useMemo` totals, savings, wishlist id Set | contexts | derived data, used in several places |
| `useMemo` context `value` | all contexts | a new object each render would re-render every consumer |
| `useCallback` cart/wishlist/auth/admin actions | contexts, `AdminPage` | passed to memoized children, stable references let `memo` skip |
| `React.memo` | `ProductCard`, `CartItem`, `AdminProductRow`, `AddProductForm` | rendered in lists, or heavy to re-render while the user types elsewhere |
| `React.lazy` + `Suspense` | `App.jsx` | every page is its own chunk, smaller first load |

Not memoized on purpose: `Button`, `Input`, `Modal`, `Badge`, page components.
They are cheap to render and memoizing them would only add code.

## Known limits (good to mention in a review)

- Passwords are plain text in the bundle. Fine for a demo, never for production.
- Orders are not saved anywhere, they only live in router state for the success page.
- The cart is shared on the browser, it is not tied to a user account.
