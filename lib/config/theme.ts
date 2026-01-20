/**
 * Deligo Brand Theme Configuration
 * Centralized color palette for consistency across the website
 */

export const DELIGO_THEME = {
  // Primary green color (from app)
  primary: {
    DEFAULT: '#10B981', // emerald-500
    light: '#34D399',   // emerald-400
    dark: '#059669',    // emerald-600
    hover: '#047857',   // emerald-700
  },
  
  // Accent colors
  secondary: {
    DEFAULT: '#14B8A6', // teal-500
    light: '#5EEAD4',   // teal-300
    dark: '#0F766E',    // teal-700
  },
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Backgrounds
  bg: {
    primary: '#10B981',
    primaryLight: 'rgba(16, 185, 129, 0.1)',
    primaryHover: '#059669',
  },
  
  // Text
  text: {
    primary: '#10B981',
    primaryHover: '#047857',
  },
  
  // Border
  border: {
    primary: '#10B981',
  },
} as const

// CSS class helpers
export const themeClasses = {
  button: {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    primaryOutline: 'border-emerald-500 text-emerald-600 hover:bg-emerald-50',
  },
  text: {
    primary: 'text-emerald-600',
    primaryHover: 'text-emerald-600 hover:text-emerald-700',
  },
  bg: {
    primaryLight: 'bg-emerald-500/10',
    primary: 'bg-emerald-500',
  },
  border: {
    primary: 'border-emerald-500',
  },
  icon: {
    primary: 'text-emerald-500',
  },
} as const

export default DELIGO_THEME
