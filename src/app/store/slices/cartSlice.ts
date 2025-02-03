import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Size } from "@/types/Size";
import { Color } from "@/types/Color";

// Interfaces
type CartItem = {
  id: string;
  name: string;
  price: number;
  color?: Color;
  quantity: number;
  imageUrl?: string;
  size?: Size;
  sku?: string;
};

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  isCheckoutAllowed: boolean;
}

// Funciones auxiliares para localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

const saveCartToStorage = (cartItems: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
};

// Estado inicial
const initialState: CartState = {
  items: loadCartFromStorage(),
  totalPrice: 0,
  totalItems: 0,
  isCheckoutAllowed: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCheckoutAllowed: (state, action: PayloadAction<boolean>) => {
      state.isCheckoutAllowed = action.payload;
    },

    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCartToStorage(state.items);
      state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      state.totalItems = state.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    },

    incrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        saveCartToStorage(state.items);
        state.totalPrice += item.price;
        state.totalItems += 1;
      }
    },

    decrementItem: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );
      if (itemIndex !== -1) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
          state.totalPrice -= state.items[itemIndex].price;
          state.totalItems -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }
        saveCartToStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
      state.isCheckoutAllowed = false;
      saveCartToStorage([]);
    },
  },
});

// Exports
export const {
  addItem,
  incrementItem,
  decrementItem,
  clearCart,
  setCheckoutAllowed,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalPrice = (state: { cart: CartState }) =>
  state.cart.totalPrice;
export const selectCartTotalItems = (state: { cart: CartState }) =>
  state.cart.totalItems;
export const selectIsCheckoutAllowed = (state: { cart: CartState }) =>
  state.cart.isCheckoutAllowed;

export default cartSlice.reducer;
