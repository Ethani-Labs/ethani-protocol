import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Global Stability Dark Theme
        'stability': {
          'navy': '#0B1220',      // Background utama
          'slate': '#141E30',     // Card / panel
          'border': '#22314A',    // Border halus
          'green': '#22C55E',     // Primary Accent (Agricultural Green)
          'gold': '#EAB308',      // Secondary Accent (Wheat Gold)
          'red': '#EF4444',       // Danger / Shortage (Soft Red)
          'text': '#E5E7EB',      // Text utama (Off White)
          'text-muted': '#9CA3AF',// Text secondary (Muted Grey)
        },
        'green': {
          '50': '#f0fdf4',
          '600': '#16a34a',
          '700': '#15803d',
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}

export default config
