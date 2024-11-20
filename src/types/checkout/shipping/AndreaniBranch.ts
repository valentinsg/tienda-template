import { Province } from "./Province";

/**
 * @interface AndreaniBranch
 * Represents a branch of Andreani, a logistics and distribution company.
 *
 * The `AndreaniBranch` interface defines the structure of an object that holds information about a specific branch of Andreani.
 * This includes details such as the branch ID, name, address, and contact information.
 *
 * @example
 * const branch: AndreaniBranch = {
 *   name: "Sucursal Central",
 *   address: "Av. Siempre Viva 742",
 *   province: "Buenos Aires",
 *   postalCode: "1234",
 * };
 *
 * @remarks
 * This interface can be used to ensure that objects representing Andreani branches have a consistent structure and contain all necessary information.
 */

export interface AndreaniBranch {
  
  id: string;
  /**
   * The name of the branch.
   */
  name: string;

  /**
   * The address of the branch.
   */
  address: string;

  /**
   * The province where the branch is located.
   */
  province: Province;

  /**
   * The postal code of the branch.
   */
  postalCode: string;
}
