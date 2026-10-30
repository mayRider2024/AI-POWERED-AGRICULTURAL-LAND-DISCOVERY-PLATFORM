/**
 * Shared land pricing and area calculation utilities for LandLens AI.
 *
 * Maharashtra standard agricultural measurement:
 * 1 Acre = 40 Gunthas
 * 1 Hectare = 100 Ares = 2.47105 Acres
 * 1 Are ≈ 1 Guntha (approx 100 sq m)
 */

export const GUNTHAS_PER_ACRE = 40;

/**
 * Calculates total gunthas from area in acres.
 */
export function calculateGunthas(areaAcres: number): number {
  return areaAcres * GUNTHAS_PER_ACRE;
}

/**
 * Calculates total price from acres and price per guntha.
 * total_price = area_acres × 40 × price_per_guntha
 */
export function calculateTotalPrice(areaAcres: number, pricePerGuntha: number): number {
  return areaAcres * GUNTHAS_PER_ACRE * pricePerGuntha;
}

/**
 * Calculates effective price per acre from price per guntha.
 * price_per_acre = price_per_guntha × 40
 */
export function calculatePricePerAcre(pricePerGuntha: number): number {
  return pricePerGuntha * GUNTHAS_PER_ACRE;
}

/**
 * Formats Indian Currency (e.g. ₹50,00,000 or Lakh representation)
 */
export function formatLakh(amount: number): string {
  const inLakhs = amount / 100000;
  return `₹${inLakhs.toFixed(2)} Lakh`;
}

export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
