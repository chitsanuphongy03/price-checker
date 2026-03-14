import {
  UnitType,
  convertUnit,
  getPricePerBaseUnit,
  toBaseUnit,
} from "../constants/units";

export { convertUnit, getPricePerBaseUnit, toBaseUnit };

// Format converted value with appropriate precision
export const formatConvertedValue = (value: number, unit: string): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}k ${unit}`;
  } else if (value >= 1) {
    return `${value.toFixed(2)} ${unit}`;
  } else if (value >= 0.01) {
    return `${value.toFixed(3)} ${unit}`;
  }
  return `${value.toFixed(4)} ${unit}`;
};

// Calculate equivalent quantity
export const calculateEquivalent = (
  sourceQty: number,
  sourceUnit: UnitType,
  targetUnit: UnitType,
): number => {
  return convertUnit(sourceQty, sourceUnit, targetUnit);
};

// Compare two products by base unit
export interface ComparisonByUnit {
  productName: string;
  originalQty: number;
  originalUnit: UnitType;
  baseQty: number;
  baseUnit: "g" | "ml" | "pcs";
  pricePerBase: number;
}

export const compareByBaseUnit = (
  products: { name: string; price: number; quantity: number; unit: UnitType }[],
): ComparisonByUnit[] => {
  return products
    .map((p) => {
      const base = toBaseUnit(p.quantity, p.unit);
      const pricePerBase = p.price / base.value;

      return {
        productName: p.name,
        originalQty: p.quantity,
        originalUnit: p.unit,
        baseQty: base.value,
        baseUnit: base.unit,
        pricePerBase,
      };
    })
    .sort((a, b) => a.pricePerBase - b.pricePerBase);
};
