export const ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  INCREASE_QUANTITY: 'INCREASE_QUANTITY',
  DECREASE_QUANTITY: 'DECREASE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART: {
      const product = action.payload;
      const existing = state.find((item) => item.id === product.id);

      if (existing) {
        // already in the cart, just bump the quantity
        return state.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // only keep what the cart actually needs
      const newItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      };
      return [...state, newItem];
    }

    case ACTIONS.REMOVE_FROM_CART:
      return state.filter((item) => item.id !== action.payload);

    case ACTIONS.INCREASE_QUANTITY:
      return state.map((item) =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
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

    default:
      return state;
  }
}

export default cartReducer;
