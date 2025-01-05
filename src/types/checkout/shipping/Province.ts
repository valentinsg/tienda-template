/**
 * @region Province
 * Represents a province of Argentina.
 *
 * The `Province` type is a union of string literals, each representing a province or autonomous city in Argentina.
 * This type helps to identify where our shipments are going with more clarity and ensures that the user provides accurate information.
 *
 * @example
 * const myProvince: Province = "Buenos Aires";
 *
 * @remarks
 * This type can be used to ensure that only valid province names are assigned to variables or passed to functions.
*/

export type Province =
  | "Buenos Aires"
  | "Ciudad Autónoma de Buenos Aires"
  | "Catamarca"
  | "Chaco"
  | "Chubut"
  | "Córdoba"
  | "Corrientes"
  | "Entre Ríos"
  | "Formosa"
  | "Jujuy"
  | "La Pampa"
  | "La Rioja"
  | "Mendoza"
  | "Misiones"
  | "Neuquén"
  | "Río Negro"
  | "Salta"
  | "San Juan"
  | "San Luis"
  | "Santa Cruz"
  | "Santa Fe"
  | "Santiago del Estero"
  | "Tierra del Fuego"
  | "Tucumán";