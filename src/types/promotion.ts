import { UnitType } from "../constants/units";

export enum PromotionType {
  NONE = "none",
  PERCENTAGE_DISCOUNT = "percentage_discount",
  FIXED_DISCOUNT = "fixed_discount",
  BUY_X_GET_Y = "buy_x_get_y",
  BUNDLE_PRICE = "bundle_price",
}

export interface Promotion {
  type: PromotionType;
  value: number;
  buyX?: number;
  getY?: number;
  bundleQuantity?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: UnitType;
  promotion: Promotion;
  notes?: string;
}

export interface CalculationResult {
  pricePerUnit: number;
  totalPrice: number;
  originalTotal: number;
  savingsAmount: number;
  savingsPercentage: number;
  effectiveQuantity: number;
  pricePerBaseUnit?: number;
  baseUnit?: string;
}

export interface ComparisonResult {
  winner: Product | null;
  loser: Product | null;
  winnerResult: CalculationResult;
  loserResult: CalculationResult;
  savingsPercentage: number;
  isTie: boolean;
  allResults: {
    product: Product;
    result: CalculationResult;
    rank: number;
  }[];
}

export interface HistoryItem {
  id: string;
  name: string;
  timestamp: number;
  products: Product[];
  winner: Product | null;
  savingsPercentage: number;
  mode: "simple" | "advance";
  isSaved?: boolean;
}

export type AppMode = "simple" | "advance";
