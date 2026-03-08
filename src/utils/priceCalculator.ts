import { Product, PromotionType, CalculationResult, ComparisonResult } from '../types/promotion';
import { UnitType, toBaseUnit } from '../constants/units';

/**
 * Calculate the effective price per unit considering all promotions
 */
export function calculatePricePerUnit(product: Product): CalculationResult {
  const { price, quantity, promotion, unit } = product;
  const originalTotal = price * quantity;

  let totalPrice = originalTotal;
  let effectiveQuantity = quantity;

  switch (promotion.type) {
    case PromotionType.PERCENTAGE_DISCOUNT: {
      const discountMultiplier = Math.max(0, 1 - promotion.value / 100);
      totalPrice = originalTotal * discountMultiplier;
      break;
    }

    case PromotionType.FIXED_DISCOUNT: {
      totalPrice = Math.max(0, originalTotal - promotion.value);
      break;
    }

    case PromotionType.BUY_X_GET_Y: {
      const { buyX = 1, getY = 1 } = promotion;
      const cycles = Math.floor(quantity / buyX);
      const bonusItems = cycles * getY;
      effectiveQuantity = quantity + bonusItems;
      break;
    }

    case PromotionType.BUNDLE_PRICE: {
      const bundleQty = promotion.bundleQuantity || 1;
      const bundlePrice = promotion.value;
      const bundles = Math.floor(quantity / bundleQty);
      const remainder = quantity % bundleQty;
      totalPrice = bundles * bundlePrice + remainder * price;
      break;
    }

    case PromotionType.NONE:
    default:
      totalPrice = originalTotal;
      break;
  }

  const pricePerUnit = totalPrice / effectiveQuantity;
  const savingsAmount = originalTotal - totalPrice;
  const savingsPercentage = originalTotal > 0 ? (savingsAmount / originalTotal) * 100 : 0;

  // Calculate price per base unit (g or ml)
  const baseInfo = toBaseUnit(effectiveQuantity, unit);
  const pricePerBaseUnit = baseInfo.value > 0 ? totalPrice / baseInfo.value : pricePerUnit;

  return {
    pricePerUnit,
    totalPrice,
    originalTotal,
    savingsAmount,
    savingsPercentage,
    effectiveQuantity,
    pricePerBaseUnit,
    baseUnit: baseInfo.unit,
  };
}

/**
 * Compare multiple products and determine the best deal
 */
export function compareMultipleProducts(products: Product[]): ComparisonResult {
  const results = products.map(product => ({
    product,
    result: calculatePricePerUnit(product),
  }));

  // Sort by price per unit (ascending)
  const sorted = [...results].sort((a, b) => a.result.pricePerUnit - b.result.pricePerUnit);
  
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  // Calculate savings compared to worst
  const savingsPercentage = worst.result.pricePerUnit > 0 
    ? ((worst.result.pricePerUnit - best.result.pricePerUnit) / worst.result.pricePerUnit) * 100 
    : 0;

  const isTie = sorted.every(r => r.result.pricePerUnit === sorted[0].result.pricePerUnit);

  return {
    winner: isTie ? null : best.product,
    loser: isTie ? null : worst.product,
    winnerResult: best.result,
    loserResult: worst.result,
    savingsPercentage,
    isTie,
    allResults: sorted.map((r, idx) => ({
      product: r.product,
      result: r.result,
      rank: idx + 1,
    })),
  };
}

/**
 * Format a price with currency symbol
 */
export function formatPrice(price: number, currency = '$'): string {
  if (price < 0.01) {
    return `${currency}${price.toFixed(4)}`;
  }
  if (price < 1) {
    return `${currency}${price.toFixed(3)}`;
  }
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Validate product input
 */
export function validateProduct(product: Product): { isValid: boolean; error?: string } {
  if (product.price <= 0) {
    return { isValid: false, error: 'priceMustBeGreater' };
  }
  if (product.quantity <= 0) {
    return { isValid: false, error: 'quantityMustBeGreater' };
  }
  return { isValid: true };
}

// Keep backward compatibility
export function compareProducts(productA: Product, productB: Product): ComparisonResult {
  return compareMultipleProducts([productA, productB]);
}
