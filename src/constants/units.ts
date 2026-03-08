export type UnitCategory = 'weight' | 'volume' | 'quantity';

export type UnitType = 
  // Weight
  | 'mg' | 'g' | 'kg' | 'oz' | 'lb'
  // Volume
  | 'ml' | 'cl' | 'l' | 'fl_oz' | 'gal'
  // Quantity
  | 'pcs' | 'pack' | 'box' | 'set';

export interface UnitDefinition {
  id: UnitType;
  name: string;
  nameTh: string;
  category: UnitCategory;
  toBase: number; // Conversion factor to base unit (g for weight, ml for volume)
}

export const UNITS: UnitDefinition[] = [
  // Weight - base is grams (g)
  { id: 'mg', name: 'mg', nameTh: 'มิลลิกรัม', category: 'weight', toBase: 0.001 },
  { id: 'g', name: 'g', nameTh: 'กรัม', category: 'weight', toBase: 1 },
  { id: 'kg', name: 'kg', nameTh: 'กิโลกรัม', category: 'weight', toBase: 1000 },
  { id: 'oz', name: 'oz', nameTh: 'ออนซ์', category: 'weight', toBase: 28.3495 },
  { id: 'lb', name: 'lb', nameTh: 'ปอนด์', category: 'weight', toBase: 453.592 },
  
  // Volume - base is milliliters (ml)
  { id: 'ml', name: 'ml', nameTh: 'มิลลิลิตร', category: 'volume', toBase: 1 },
  { id: 'cl', name: 'cl', nameTh: 'เซนติลิตร', category: 'volume', toBase: 10 },
  { id: 'l', name: 'L', nameTh: 'ลิตร', category: 'volume', toBase: 1000 },
  { id: 'fl_oz', name: 'fl oz', nameTh: 'ฟลูอิดออนซ์', category: 'volume', toBase: 29.5735 },
  { id: 'gal', name: 'gal', nameTh: 'แกลลอน', category: 'volume', toBase: 3785.41 },
  
  // Quantity - no conversion
  { id: 'pcs', name: 'pcs', nameTh: 'ชิ้น', category: 'quantity', toBase: 1 },
  { id: 'pack', name: 'pack', nameTh: 'แพ็ค', category: 'quantity', toBase: 1 },
  { id: 'box', name: 'box', nameTh: 'กล่อง', category: 'quantity', toBase: 1 },
  { id: 'set', name: 'set', nameTh: 'เซต', category: 'quantity', toBase: 1 },
];

export const getUnitById = (id: UnitType): UnitDefinition => {
  return UNITS.find(u => u.id === id) || UNITS[1]; // Default to grams
};

export const getUnitsByCategory = (category: UnitCategory): UnitDefinition[] => {
  return UNITS.filter(u => u.category === category);
};

export const convertUnit = (value: number, from: UnitType, to: UnitType): number => {
  const fromUnit = getUnitById(from);
  const toUnit = getUnitById(to);
  
  // If same category, convert
  if (fromUnit.category === toUnit.category) {
    const baseValue = value * fromUnit.toBase;
    return baseValue / toUnit.toBase;
  }
  
  // Cannot convert between different categories
  return value;
};

// Convert to base unit (g or ml)
export const toBaseUnit = (value: number, from: UnitType): { value: number; unit: 'g' | 'ml' | 'pcs' } => {
  const unit = getUnitById(from);
  const baseValue = value * unit.toBase;
  
  if (unit.category === 'weight') {
    return { value: baseValue, unit: 'g' };
  } else if (unit.category === 'volume') {
    return { value: baseValue, unit: 'ml' };
  }
  return { value, unit: 'pcs' };
};

// Get price per base unit
export const getPricePerBaseUnit = (
  price: number, 
  quantity: number, 
  unit: UnitType
): { price: number; unit: string } => {
  const base = toBaseUnit(quantity, unit);
  const pricePerUnit = price / base.value;
  
  if (base.unit === 'g') {
    return { price: pricePerUnit, unit: '/g' };
  } else if (base.unit === 'ml') {
    return { price: pricePerUnit, unit: '/ml' };
  }
  return { price: pricePerUnit, unit: '/pcs' };
};
