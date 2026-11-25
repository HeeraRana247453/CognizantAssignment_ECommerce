export const ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  INCREASE_QUANTITY: 'INCREASE_QUANTITY',
  DECREASE_QUANTITY: 'DECREASE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SYNC_WITH_CATALOG: 'SYNC_WITH_CATALOG',
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART: {
      const product = action.payload;
      const existing = state.find((item) => item.id === product.id);

      if (existing) {
        // can't add more than we have in stock
        if (existing.quantity >= existing.stock) return state;

        return state.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      if (product.stock < 1) return state;

      // `price` is the price actually charged (after discount),
      // originalPrice is kept so the cart can show the saving
      const newItem = {
        id: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.finalPrice,
        originalPrice: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        quantity: 1,
      };
      return [...state, newItem];
    }

    case ACTIONS.REMOVE_FROM_CART:
      return state.filter((item) => item.id !== action.payload);

    case ACTIONS.INCREASE_QUANTITY:
      return state.map((item) =>
        item.id === action.payload && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case ACTIONS.DECREASE_QUANTITY:
      return state.map((item) =>
        // never go below 1, the remove button is for deleting
        item.id === action.payload && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

    case ACTIONS.CLEAR_CART:
      return [];

    // The admin can change prices, stock or hide products at any time.
    // This brings the cart back in line with the latest catalog.
    case ACTIONS.SYNC_WITH_CATALOG: {
      const catalog = new Map(action.payload.map((product) => [product.id, product]));
      let changed = false;
      const next = [];

      for (const item of state) {
        const product = catalog.get(item.id);
        const unavailable =
          !product || !product.isActive || product.isRemoved || product.stock < 1;

        if (unavailable) {
          changed = true; // drop it from the cart
          continue;
        }

        const quantity = Math.min(item.quantity, product.stock);
        const upToDate =
          item.title === product.title &&
          item.price === product.finalPrice &&
          item.originalPrice === product.price &&
          item.discountPercentage === product.discountPercentage &&
          item.stock === product.stock &&
          item.quantity === quantity;

        if (upToDate) {
          next.push(item);
        } else {
          changed = true;
          next.push({
            ...item,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.finalPrice,
            originalPrice: product.price,
            discountPercentage: product.discountPercentage,
            stock: product.stock,
            quantity,
          });
        }
      }

      // returning the same array when nothing changed avoids pointless re-renders
      return changed ? next : state;
    }

    default:
      return state;
  }
}

export default cartReducer;
