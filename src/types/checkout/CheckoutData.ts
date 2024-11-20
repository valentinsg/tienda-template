import { ClientPersonalInfo } from '../client/ClientData';
import { ShippingDetails } from './shipping/ShippingDetails';
import { PaymentMethod } from './payment/PaymentMethod';
import { Product } from '../Product';

/**
 * Represents the data required for a checkout process.
 *
 * The `CheckoutData` interface defines the structure of an object that holds all the necessary information for completing a checkout.
 * This includes personal information, shipping details, payment method, and the items in the order.
 *
 * @example
 * const checkoutData: CheckoutData = {
 *   personalInfo: {
 *     name: 'John',
 *     lastName: 'Doe',
 *     email: 'john.doe@example.com',
 *     phone: '123-456-7890',
 *     age: 30
 *   },
 *   shippingDetails: {
 *     method: 'home',
 *     address: '123 Main St',
 *     province: 'Buenos Aires',
 *     postalCode: '1234'
 *   },
 *   paymentMethod: 'creditCard',
 *   products: [
 *     {
 *       id: '1',
 *       name: 'Product 1',
 *       quantity: 2,
 *       price: 100
 *     },
 *     {
 *       id: '2',
 *       name: 'Product 2',
 *       quantity: 1,
 *       price: 50
 *     }
 *   ]
 * };
 */
export interface CheckoutData {
  /**
   * The personal information of the client.
   */
  personalInfo: ClientPersonalInfo;
  /**
   * The details of the shipping method.
   */
  shippingDetails: ShippingDetails;
  /**
   * The method of payment.
   */
  paymentMethod: PaymentMethod;
  /**
   * The products included in the order.
   */
  products: Product[];
}