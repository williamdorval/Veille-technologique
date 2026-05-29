// unit-converter.ts — Conversion d'unités (base interne : mm)
export type UnitDisplay = 'mm' | 'cm' | 'm' | 'po';
const TO_MM: Record<UnitDisplay, number> = { mm: 1, cm: 10, m: 1000, po: 25.4 };
export function convertToMm(value: number, unit: UnitDisplay): number { return value * TO_MM[unit]; }
export function convertFromMm(mm: number, unit: UnitDisplay): number { return mm / TO_MM[unit]; }
export function formatMeasurement(mm: number, unit: UnitDisplay, decimals?: number): string {
  const value = convertFromMm(mm, unit);
  const d = decimals ?? (unit === 'mm' ? 0 : unit === 'cm' ? 1 : unit === 'm' ? 3 : 2);
  return `${value.toFixed(d)} ${unit}`;
}
export function stepForUnit(unit: UnitDisplay): string {
  return unit === 'mm' ? '1' : unit === 'cm' ? '0.1' : unit === 'm' ? '0.001' : '0.25';
}
