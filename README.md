# ShopEase

A small e-commerce app built for the React training assignment.
Built with React 18, Vite and React Router. Product data comes from the
[DummyJSON](https://dummyjson.com/docs/products) API.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).
Use `npm run build` for a production build.

## Folder structure

```
src/
  api/          fetch calls to DummyJSON
  components/   reusable UI (ProductCard, CartItem, Navbar, SearchFilterBar...)
  context/      CartContext - shares cart state across the app
  pages/        one file per route
  reducers/     cartReducer - all cart logic lives here
  utils/        price formatting and form validation helpers
```

## Routes

| Path            | Page                 |
| --------------- | -------------------- |
| `/`             | Product list         |
| `/products/:id` | Product details      |
| `/cart`         | Cart                 |
| `/checkout`     | Checkout form        |

## Where each required concept is used

| Concept                  | Where                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| useState                 | list page filters, checkout form, details page                     |
| useEffect                | fetching data, saving cart to localStorage                         |
| useMemo                  | `visibleProducts` and `categories` (list page), totals (context)   |
| useReducer               | `CartContext` + `cartReducer`                                      |
| useCallback              | cart handlers in `CartContext`                                     |
| React.memo               | `ProductCard`, `CartItem`                                          |
| React Router             | `App.jsx`, `useParams` in details page, `Link` / `NavLink`         |
| map() / filter()         | product grid, category list, search filter, reducer                |
| Conditional rendering    | loading / error / empty states, cart badge, "Add another" button   |

## Why useCallback?

`handleAddToCart`, `handleIncrease` etc. are passed as props to `ProductCard`
and `CartItem`, which are wrapped in `React.memo`. Without `useCallback` a new
function is created on every render, so the props always look "changed" and
`memo` can't skip anything. With `useCallback` (and an empty dependency array,
since `dispatch` is stable) the function reference stays the same, so typing
in the search box doesn't re-render every card.

## Why useMemo for the product list?

Search text, category and sort order all feed into `visibleProducts`. It is
wrapped in `useMemo` with `[products, searchTerm, category, sortOrder]` so the
filter + sort only runs when one of those changes, not when something
unrelated (like the cart) causes a re-render.

## Cart actions

`ADD_TO_CART`, `REMOVE_FROM_CART`, `INCREASE_QUANTITY`, `DECREASE_QUANTITY`
and `CLEAR_CART` are handled in `src/reducers/cartReducer.js`. The cart is also
saved to localStorage so it is still there after a refresh.
