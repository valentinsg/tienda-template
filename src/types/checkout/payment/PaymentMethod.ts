/**
 * @typedef PaymentMethod
 * Represents the available payment methods.
 *
 * The `PaymentMethod` type is a union of string literals, each representing a different method of payment.
 * This type helps to ensure that only valid payment methods are used in the application.
 *
 * @example
 * const myPaymentMethod: PaymentMethod = 'creditCard';
 *
 * @remarks
 * This type can be used to ensure that only valid payment methods are assigned to variables or passed to functions.
*/

export type PaymentMethod = "creditCard" | "debitCard" | "transfer";
