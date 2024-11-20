// Importaciones necesarias de Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CartItem } from '@/types/CartItem';

// Estado inicial del carrito
interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
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
        // Si el producto ya existe, aumentamos su cantidad
        existingItem.quantity += action.payload.quantity;
      } else {
        // Si no existe, lo añadimos al carrito
        state.items.push(action.payload);
      }
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