/**
 * ETHANI Design System
 * Dark theme, Web3 style, farmer-friendly
 */

export const COLORS = {
  // Primary palette
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',    // PRIMARY
    700: '#15803d',
    800: '#166534',
    900: '#145231',
  },
  
  // Accent (gold/yellow)
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',    // ACCENT
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Dark theme neutrals
  dark: {
    bg: '#0f172a',     // Near black (slate-900)
    card: '#1e293b',   // Card background (slate-800)
    border: '#334155', // Border (slate-700)
    text: '#f1f5f9',   // Primary text (slate-100)
    muted: '#94a3b8',  // Muted text (slate-400)
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const BORDER_RADIUS = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
} as const;

export const TYPOGRAPHY = {
  h1: {
    size: '2.5rem',
    weight: 700,
    lineHeight: 1.2,
  },
  h2: {
    size: '2rem',
    weight: 700,
    lineHeight: 1.3,
  },
  h3: {
    size: '1.5rem',
    weight: 600,
    lineHeight: 1.4,
  },
  body: {
    size: '1rem',
    weight: 400,
    lineHeight: 1.6,
  },
  small: {
    size: '0.875rem',
    weight: 400,
    lineHeight: 1.5,
  },
  tiny: {
    size: '0.75rem',
    weight: 400,
    lineHeight: 1.4,
  },
} as const;
