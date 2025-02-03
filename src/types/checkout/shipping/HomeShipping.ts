
/**
 * @interface HomeShippingDetails
 * Represents the details required for home shipping.
 *
 * The `HomeShippingDetails` interface defines the structure of an object that holds information about a home shipping method.
 * This includes details such as the shipping method, address, province, and postal code.
 *
 * @example
 * const shippingDetails: HomeShippingDetails = {
 *   method: 'home',
 *   address: '123 Main St',
 *   province: 'Buenos Aires',
 *   postalCode: '1234'
 * };
 *
 * @remarks
 * This interface can be used to ensure that objects representing home shipping details have a consistent structure and contain all necessary information.
 */


export interface HomeShippingDetails {
  address: string;
  apartment: string;
  province: string;
  postal_code: string;
  city: string;
}
