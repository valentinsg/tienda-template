// Importaciones necesarias de Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CartItem } from '@/types/CartItem';

// Estado inicial del carrito
interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
};
// Creación del slice para manejar las acciones y el estado del carrito
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    //#region Add Item

    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
    
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    
      // Actualizamos el precio total y los productos totales
      state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
    },
    //#endregion

    //#region Increment Item

    incrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    //#endregion

    //#region Decrement Item

    decrementItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Eliminar el producto si la cantidad es 1
          state.items = state.items.filter(item => item.id !== action.payload);
        }
      }
    },
    //#endregion

    //#region Clear Cart
    
    clearCart: (state) => {
      state.items = [];
    },
    //#endregion
  },
});

export const { addItem, incrementItem, decrementItem, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
export const selectCartItems = (state: RootState) => state.cart.items;