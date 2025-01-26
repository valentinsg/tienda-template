import { Size } from '@/types/Size';
import {Color } from '@/types/Color';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Add the cart property type to AppState
interface AppState {
  cart: CartState;
}

// Interfaces
interface CartItem {
  id: string;
  name: string;
  price: number;
  color?: Color;
  quantity: number;
  imageUrl?: string;
  size?: Size;
  sku?: string;

}
interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  isCheckoutAllowed: boolean;
}

// Estado inicial
const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  isCheckoutAllowed: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCheckoutAllowed: (state, action: PayloadAction<boolean>) => {
      state.isCheckoutAllowed = action.payload;
    },
    
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
    
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    
      // Actualizar totales
      state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
    },
    
    incrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        // Actualizar totales
        state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
      }
    },
    
    decrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== action.payload);
        }
        // Actualizar totales
        state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
      state.isCheckoutAllowed = false;
    },
  },
});

// Exports
export const {
  addItem,
  incrementItem,
  decrementItem,
  clearCart,
  setCheckoutAllowed
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: AppState) => state.cart.items;
export const selectCartTotalPrice = (state: AppState) => state.cart.totalPrice;
export const selectCartTotalItems = (state: AppState) => state.cart.totalItems;
export const selectIsCheckoutAllowed = (state: AppState) => state.cart.isCheckoutAllowed;

export default cartSlice.reducer;