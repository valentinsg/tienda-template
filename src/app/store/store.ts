import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Exportamos los tipos RootState y AppDispatch para usarlos en el proyecto
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;