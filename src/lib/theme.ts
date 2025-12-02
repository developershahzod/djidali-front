/**
 * Design System Theme Tokens
 *
 * Central source of truth for colors, spacing, and design tokens.
 * These values mirror tailwind.config.js for JS-level access.
 */

export const colors = {
  // Brand primary - warm brown tones (used for CTAs, accents)
  primary: {
    50: '#f5f3ed',
    100: '#e8e3d3',
    200: '#d4cab0',
    300: '#bfac87',
    400: '#a89563',
    500: '#8B7355', // Main brand color
    600: '#7a673d',
    700: '#645333',
    800: '#50432c',
    900: '#433826',
  },

  // Earth tones - neutral backgrounds
  earth: {
    50: '#fafaf8',
    100: '#f2f1ed',
    200: '#e5e3da',
    300: '#d1cdc0',
    400: '#b5afa0',
    500: '#9a9283',
    600: '#7e7767',
    700: '#635f52',
    800: '#4d4a41',
    900: '#3a3833',
  },

  // Nature greens - success states, nature imagery
  nature: {
    50: '#f5f7f5',
    100: '#e8ede8',
    200: '#d1dbd1',
    300: '#afc2af',
    400: '#85a285',
    500: '#5f8560',
    600: '#4a6a4b',
    700: '#3c553d',
    800: '#324532',
    900: '#2a3a2b',
  },

  // Semantic colors
  white: '#ffffff',
  black: '#000000',

  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  '4xl': '2rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

export const transitions = {
  fast: '150ms ease',
  DEFAULT: '200ms ease',
  slow: '300ms ease',
} as const;

// Component-specific tokens
export const components = {
  button: {
    primary: {
      bg: colors.primary[500],
      bgHover: colors.primary[600],
      text: colors.white,
    },
    secondary: {
      bg: colors.earth[100],
      bgHover: colors.earth[200],
      text: colors.earth[800],
    },
  },
  input: {
    bg: colors.white,
    border: colors.gray[300],
    borderFocus: colors.primary[500],
    text: colors.gray[900],
    placeholder: colors.gray[400],
  },
  calendar: {
    selected: colors.primary[500],
    selectedText: colors.white,
    range: colors.primary[100],
    hover: colors.primary[50],
    today: colors.primary[200],
  },
} as const;

export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof spacing;
