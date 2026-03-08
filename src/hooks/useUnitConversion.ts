import { useCallback } from 'react';
import { UnitType, convertUnit, toBaseUnit, getPricePerBaseUnit } from '../constants/units';

export function useUnitConversion() {
  const convert = useCallback((value: number, from: UnitType, to: UnitType): number => {
    return convertUnit(value, from, to);
  }, []);

  const toBase = useCallback((value: number, from: UnitType) => {
    return toBaseUnit(value, from);
  }, []);

  const getPricePerUnit = useCallback((price: number, quantity: number, unit: UnitType) => {
    return getPricePerBaseUnit(price, quantity, unit);
  }, []);

  const canConvert = useCallback((from: UnitType, to: UnitType): boolean => {
    const fromUnit = getUnitById(from);
    const toUnit = getUnitById(to);
    return fromUnit.category === toUnit.category;
  }, []);

  return { convert, toBase, getPricePerUnit, canConvert };
}

function getUnitById(id: UnitType) {
  const { getUnitById } = require('../constants/units');
  return getUnitById(id);
}
