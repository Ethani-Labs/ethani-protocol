/**
 * DEPRECATED: Use @/lib/api-client instead
 * 
 * This file contained frontend price calculations which violate ETHANI principles.
 * All price calculations must be performed by backend only.
 * 
 * Kept for reference only - not imported anywhere.
 */

export interface PriceResult {
  region: string;
  base_price: number;
  supply: number;
  demand: number;
  final_price: number;
  reason: string;
  method: string;
  ai_used: boolean;
}

export async function calculatePrice(): Promise<PriceResult> {
  throw new Error(
    'Price calculation moved to backend API. ' +
    'Use apiClient.getPrice() from lib/api-client instead.'
  );
}

export async function getSupplyDemandRatio() {
  throw new Error('Use apiClient from lib/api-client instead');
}

export async function getDetailedPrice() {
  throw new Error('Use apiClient from lib/api-client instead');
}

export async function getPricingRules() {
  throw new Error('Use apiClient from lib/api-client instead');
}

export async function healthCheck() {
  throw new Error('Use apiClient from lib/api-client instead');
}
