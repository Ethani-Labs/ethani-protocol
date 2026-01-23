/**
 * DEMO MODE Utilities
 * 
 * This module contains all demo mode logic.
 * Can be completely removed by setting NEXT_PUBLIC_DEMO_MODE=false
 * 
 * Safety: All demo logic is guarded by environment variable checks
 */

export const DEMO_MODE_ENABLED = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const DEMO_DEFAULTS = {
  name: 'Ethani Demo User',
  phone: '0000000000',
  email: 'demo@ethani.org',
  national_id: '',
  location: 'global',
};

/**
 * Check if demo mode is enabled
 * Returns true only if explicitly set to 'true'
 */
export const isDemoMode = (): boolean => {
  return DEMO_MODE_ENABLED;
};

/**
 * Get demo default values
 * Only call this when demo mode is confirmed enabled
 */
export const getDemoDefaults = () => {
  if (!isDemoMode()) {
    return null;
  }
  return { ...DEMO_DEFAULTS };
};

/**
 * Validate demo mode is safe (should only ever be true in demo)
 * This is a safety check
 */
export const validateDemoMode = (): boolean => {
  if (!isDemoMode()) {
    return false;
  }
  
  // Additional safety: log when demo mode is active
  if (typeof window !== 'undefined') {
    console.log('🎭 ETHANI DEMO MODE ENABLED - Registration validation bypassed');
  }
  
  return true;
};
