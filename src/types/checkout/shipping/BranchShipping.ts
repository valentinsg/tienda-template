import { AndreaniBranch } from "./AndreaniBranch";

/**
 * @interface BranchShippingDetails
 * Represents the details required for branch shipping.
 *
 * The `BranchShippingDetails` interface defines the structure of an object that holds information about a branch shipping method.
 * This includes details such as the shipping method and the selected branch.
 *
 * @example
 * const branchShipping: BranchShippingDetails = {
 *   method: 'branch',
 *   selectedBranch: {
 *     name: 'Sucursal Central',
 *     address: 'Av. Siempre Viva 742',
 *     province: 'Buenos Aires',
 *     postalCode: '1234',
 *   }
 * };
 *
 * @remarks
 * This interface can be used to ensure that objects representing branch shipping details have a consistent structure and contain all necessary information.
 */

export interface BranchShippingDetails {
  /**
   * The shipping method, which is always 'branch' for branch shipping.
   */
  method: 'branch';

  /**
   * The selected branch where the shipment will be picked up.
   */
  selectedBranch: AndreaniBranch;
}