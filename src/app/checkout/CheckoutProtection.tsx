'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCartItems, selectIsCheckoutAllowed } from '../store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface CheckoutProtectionProps {
  children: ReactNode;
}

const CheckoutProtection = ({ children }: CheckoutProtectionProps) => {
  const cartItems = useSelector(selectCartItems);
  const isCheckoutAllowed = useSelector(selectIsCheckoutAllowed);
  const router = useRouter();

  useEffect(() => {
    if (!cartItems.length || !isCheckoutAllowed) {
      router.replace('/');
    }
  }, [cartItems.length, isCheckoutAllowed, router]);

  // Renderizado condicional inmediato para evitar flash de contenido
  if (!cartItems.length || !isCheckoutAllowed) {
    return null;
  }

  return <>{children}</>;
};

export default CheckoutProtection;