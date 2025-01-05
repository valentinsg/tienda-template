/**
 * @interface ClientPersonalInfo
 * Represents the personal information of a client.
 *
 * The `ClientPersonalInfo` interface defines the structure of an object that holds personal details about a client.
 * This includes details such as the client's full name, email, phone number, and age.
 *
 * @example
 * const clientInfo: ClientPersonalInfo = {
 *   fullName: 'John Doe',
 *   email: 'john.doe@example.com',
 *   phone: '123-456-7890',
 *   age: 30
 * };
 *
 * @remarks
 * This interface can be used to ensure that objects representing client personal information have a consistent structure and contain all necessary information.
 */

export interface ClientPersonalInfo {
  /**
   * The name of the client.
   */
  name: string;

  /**
   * The last name of the client.
   */
  lastName: string;

  /**
   * The email address of the client.
   * This field is optional.
   */
  email?: string;

  /**
   * The phone number of the client.
   */
  phone: string;

  /**
   * The age of the client.
   * This field is optional.
   */
  age?: number;
}
