export function getRandomDiscountCode(): string {
  const DISCOUNT_CODES = [
    "HastaElFinDeLosTiempos",
    "KeepCalmAndStayBusy",
    "DosAmigosUnaVision",
  ];
  const randomIndex = Math.floor(Math.random() * DISCOUNT_CODES.length);
  return DISCOUNT_CODES[randomIndex];
}