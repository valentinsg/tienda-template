import { HomeShippingDetails } from "./HomeShipping";
import { BranchShippingDetails } from "./BranchShipping";

/**
 * @typedef {HomeShippingDetails | BranchShippingDetails} ShippingDetails
 * Represents the details required for shipping.
 *
 * The `ShippingDetails` type is a union of `HomeShippingDetails` and `BranchShippingDetails`.
 * This type helps to ensure that the shipping details provided are either for home shipping or branch shipping.
 *
 * @example
 * const homeShipping: ShippingDetails = {
 *   method: 'home',
 *   address: '123 Main St',
 *   province: 'Buenos Aires',
 *   postalCode: '1234'
 * };
 *
 * @example
 * const branchShipping: ShippingDetails = {
 *   method: 'branch',
 *   selectedBranch: {
 *     id: '123',
 *     name: 'Sucursal Central',
 *     address: 'Av. Siempre Viva 742',
 *     city: 'Springfield',
 *     province: 'Buenos Aires',
 *     postalCode: '1234',
 *     phone: '123-456-7890',
 *     email: 'contacto@sucursal.com'
 *   }
 * };
 *
 * @remarks
 * This type can be used to ensure that the shipping details provided are valid and contain all necessary information.
 */

export type ShippingDetails = HomeShippingDetails | BranchShippingDetails;
