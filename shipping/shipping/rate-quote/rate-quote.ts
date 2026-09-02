/**
 * returns a shipping rate quote in cents for a parcel weight (kg) and zone.
 */
export function rateQuote(weightKg: number, zone: number): number {
  const base = 500;
  const perKg = 120;
  const zoneFactor = 1 + zone * 0.25;
  return Math.round((base + perKg * weightKg) * zoneFactor);
}
