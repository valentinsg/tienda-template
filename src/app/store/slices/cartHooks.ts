import { useSelector } from 'react-redux';
import { selectCartItems } from './cartSlice';

export const useCartPrice = () => {
  const items = useSelector(selectCartItems);

  // Cálculo del precio total
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Cálculo del número total de productos
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return { totalPrice, totalItems };
};
