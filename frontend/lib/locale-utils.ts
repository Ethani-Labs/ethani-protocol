/**
 * Locale utilities
 * Format numbers, currency, dates based on backend config
 */

import { LocaleConfig } from './types';

const DEFAULT_LOCALE_CONFIG: LocaleConfig = {
  locale: 'en-US',
  language: 'en',
  currency: 'USD',
  currencySymbol: '$',
  decimalPlaces: 2,
  numberFormat: 'en-US',
};

let currentLocaleConfig: LocaleConfig = DEFAULT_LOCALE_CONFIG;

export function setLocaleConfig(config: LocaleConfig) {
  currentLocaleConfig = config;
}

export function getLocaleConfig(): LocaleConfig {
  return currentLocaleConfig;
}

/**
 * Format number according to locale
 * Examples:
 * - en-US: 1,234.56
 * - de-DE: 1.234,56
 * - fr-FR: 1 234,56
 */
export function formatNumber(
  value: number,
  decimals?: number,
  config: LocaleConfig = currentLocaleConfig
): string {
  const opts = {
    minimumFractionDigits: decimals ?? config.decimalPlaces,
    maximumFractionDigits: decimals ?? config.decimalPlaces,
  };

  try {
    return new Intl.NumberFormat(config.numberFormat, opts).format(value);
  } catch (error) {
    console.error('formatNumber error:', error);
    return String(value);
  }
}

/**
 * Format currency
 * Example: USD 1,234.56 or Rp 1.234.567
 */
export function formatCurrency(
  value: number,
  config: LocaleConfig = currentLocaleConfig
): string {
  const formatted = formatNumber(value, config.decimalPlaces, config);
  return `${config.currencySymbol} ${formatted}`;
}

/**
 * Format price as currency (alias for clarity)
 */
export function formatPrice(
  value: number,
  config: LocaleConfig = currentLocaleConfig
): string {
  return formatCurrency(value, config);
}

/**
 * Format quantity with unit
 * Example: 100 kg, 50 L
 */
export function formatQuantity(quantity: number, unit: string): string {
  return `${formatNumber(quantity, 1)} ${unit}`;
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'datetime' = 'short',
  config: LocaleConfig = currentLocaleConfig
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const opts: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC',
  };

  switch (format) {
    case 'short':
      opts.year = '2-digit';
      opts.month = '2-digit';
      opts.day = '2-digit';
      break;
    case 'long':
      opts.year = 'numeric';
      opts.month = 'long';
      opts.day = 'numeric';
      break;
    case 'datetime':
      opts.year = 'numeric';
      opts.month = '2-digit';
      opts.day = '2-digit';
      opts.hour = '2-digit';
      opts.minute = '2-digit';
      break;
  }

  try {
    return new Intl.DateTimeFormat(config.locale, opts).format(dateObj);
  } catch (error) {
    console.error('formatDate error:', error);
    return String(date);
  }
}

/**
 * Get tier display info
 */
export function getTierInfo(tier: string): {
  label: string;
  color: string;
  bgColor: string;
  description: string;
} {
  const tiers: Record<string, any> = {
    critical_shortage: {
      label: '🚨 Critical Shortage',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Price increased 15% - severe shortage',
    },
    shortage: {
      label: '⚠️ Shortage',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Price increased 8% - modest shortage',
    },
    balanced: {
      label: '✓ Balanced',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Price stable - supply and demand balanced',
    },
    surplus: {
      label: '📦 Surplus',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Price decreased 10% - abundant supply',
    },
  };

  return tiers[tier] || tiers.balanced;
}

/**
 * Get role display name
 */
export function getRoleName(role: string): string {
  const roles: Record<string, string> = {
    farmer: '🌾 Farmer',
    livestock_farmer: '🐄 Livestock Farmer',
    distributor: '🚚 Distributor',
    buyer_restaurant: '🍽️ Restaurant Buyer',
    buyer_factory: '🏭 Factory Buyer',
    buyer_market: '🛒 Market Buyer',
    buyer_msme: '🏪 MSME',
    circular_economy: '♻️ Circular Economy',
    learner: '📚 Learner',
  };

  return roles[role] || role;
}

/**
 * Get role icon emoji
 */
export function getRoleIcon(role: string): string {
  const icons: Record<string, string> = {
    farmer: '🌾',
    livestock_farmer: '🐄',
    distributor: '🚚',
    buyer_restaurant: '🍽️',
    buyer_factory: '🏭',
    buyer_market: '🛒',
    buyer_msme: '🏪',
    circular_economy: '♻️',
    learner: '📚',
  };

  return icons[role] || '👤';
}

/**
 * Parse percentage change
 */
export function getPercentageChange(multiplier: number): {
  percentage: number;
  label: string;
  direction: 'up' | 'down' | 'stable';
} {
  const change = (multiplier - 1) * 100;
  const absChange = Math.abs(change);

  let direction: 'up' | 'down' | 'stable' = 'stable';
  if (change > 0.5) direction = 'up';
  if (change < -0.5) direction = 'down';

  return {
    percentage: Number(change.toFixed(2)),
    label: `${direction === 'up' ? '+' : ''}${change.toFixed(1)}%`,
    direction,
  };
}
