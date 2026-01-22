/**
 * ============================================================================
 * THEME STORE - COMPREHENSIVE THEMING SYSTEM
 * ============================================================================
 *
 * Purpose: Manage visual themes, color palettes, and dark mode
 * Matches the Octili Admin Panel design system
 *
 * Features:
 * - 6 Color Themes: Octili, Ocean, Sunset, Violet, Rose, Slate
 * - 5 Visual Styles: Bento, Glassmorphism, Neumorphic, Minimal, Bold
 * - Light/Dark mode support
 * - Persistent storage
 *
 * @author Octili Development Team
 * @version 1.0.0
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Available color themes
 */
export type ColorTheme = 'octili' | 'ocean' | 'sunset' | 'violet' | 'rose' | 'slate'

/**
 * Available visual styles
 */
export type VisualStyle = 'bento' | 'glass' | 'neumorphic' | 'minimal' | 'bold'

/**
 * Color mode (light, dark, or system preference)
 */
export type ColorMode = 'light' | 'dark' | 'system'

/**
 * Theme store state interface
 */
export interface ThemeState {
  colorTheme: ColorTheme
  visualStyle: VisualStyle
  colorMode: ColorMode
  isDarkMode: boolean
  setColorTheme: (theme: ColorTheme) => void
  setVisualStyle: (style: VisualStyle) => void
  setColorMode: (mode: ColorMode) => void
  toggleDarkMode: () => void
}

// ============================================================================
// COLOR THEME DEFINITIONS
// ============================================================================

export const COLOR_THEMES: Record<ColorTheme, {
  name: string
  primary: string
  secondary: string
  gradient: string
  colors: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
  }
}> = {
  octili: {
    name: 'Octili',
    primary: '#24BD68',
    secondary: '#00A77E',
    gradient: 'linear-gradient(135deg, #24BD68 0%, #00A77E 100%)',
    colors: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#24BD68',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },
  },
  ocean: {
    name: 'Ocean',
    primary: '#3B82F6',
    secondary: '#06B6D4',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    colors: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
  },
  sunset: {
    name: 'Sunset',
    primary: '#F97316',
    secondary: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
    colors: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
  },
  violet: {
    name: 'Violet',
    primary: '#8B5CF6',
    secondary: '#A855F7',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    colors: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
  },
  rose: {
    name: 'Rose',
    primary: '#F43F5E',
    secondary: '#EC4899',
    gradient: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)',
    colors: {
      50: '#FFF1F2',
      100: '#FFE4E6',
      200: '#FECDD3',
      300: '#FDA4AF',
      400: '#FB7185',
      500: '#F43F5E',
      600: '#E11D48',
      700: '#BE123C',
      800: '#9F1239',
      900: '#881337',
    },
  },
  slate: {
    name: 'Slate',
    primary: '#475569',
    secondary: '#64748B',
    gradient: 'linear-gradient(135deg, #475569 0%, #64748B 100%)',
    colors: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
}

// ============================================================================
// VISUAL STYLE DEFINITIONS
// ============================================================================

export const VISUAL_STYLES: Record<VisualStyle, {
  name: string
  description: string
  borderRadius: string
  cardShadow: string
  cardShadowHover: string
  cardBorder: string
  cardBackground: string
  backdropBlur: string
}> = {
  bento: {
    name: 'Bento Grid',
    description: 'Clean, minimal with subtle shadows',
    borderRadius: '16px',
    cardShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    cardShadowHover: '0 8px 24px rgba(0, 0, 0, 0.08)',
    cardBorder: '1px solid rgba(0, 0, 0, 0.06)',
    cardBackground: 'white',
    backdropBlur: 'none',
  },
  glass: {
    name: 'Glassmorphism',
    description: 'Frosted glass with blur effects',
    borderRadius: '20px',
    cardShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    cardShadowHover: '0 16px 48px rgba(0, 0, 0, 0.12)',
    cardBorder: '1px solid rgba(255, 255, 255, 0.5)',
    cardBackground: 'rgba(255, 255, 255, 0.7)',
    backdropBlur: 'blur(16px) saturate(180%)',
  },
  neumorphic: {
    name: 'Neumorphism',
    description: 'Soft 3D embossed surfaces',
    borderRadius: '24px',
    cardShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
    cardShadowHover: '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
    cardBorder: 'none',
    cardBackground: '#f0f4f8',
    backdropBlur: 'none',
  },
  minimal: {
    name: 'Minimal',
    description: 'Ultra-clean, no decorations',
    borderRadius: '12px',
    cardShadow: 'none',
    cardShadowHover: '0 4px 12px rgba(0, 0, 0, 0.06)',
    cardBorder: 'none',
    cardBackground: 'white',
    backdropBlur: 'none',
  },
  bold: {
    name: 'Bold',
    description: 'High contrast with strong borders',
    borderRadius: '8px',
    cardShadow: '4px 4px 0 rgba(0, 0, 0, 0.1)',
    cardShadowHover: '6px 6px 0 rgba(0, 0, 0, 0.15)',
    cardBorder: '2px solid currentColor',
    cardBackground: 'white',
    backdropBlur: 'none',
  },
}

// ============================================================================
// CSS VARIABLE GENERATOR
// ============================================================================

/**
 * Generate CSS variables for the current theme configuration
 */
export function generateThemeCSS(
  colorTheme: ColorTheme,
  visualStyle: VisualStyle,
  isDarkMode: boolean
): Record<string, string> {
  const colors = COLOR_THEMES[colorTheme]
  const style = VISUAL_STYLES[visualStyle]

  const variables: Record<string, string> = {
    // Brand colors
    '--brand-primary': colors.primary,
    '--brand-secondary': colors.secondary,
    '--brand-gradient': colors.gradient,

    // Color scale
    '--brand-50': colors.colors[50],
    '--brand-100': colors.colors[100],
    '--brand-200': colors.colors[200],
    '--brand-300': colors.colors[300],
    '--brand-400': colors.colors[400],
    '--brand-500': colors.colors[500],
    '--brand-600': colors.colors[600],
    '--brand-700': colors.colors[700],
    '--brand-800': colors.colors[800],
    '--brand-900': colors.colors[900],

    // Visual style
    '--card-radius': style.borderRadius,
    '--card-shadow': style.cardShadow,
    '--card-shadow-hover': style.cardShadowHover,
    '--card-border': style.cardBorder,
    '--card-background': style.cardBackground,
    '--backdrop-blur': style.backdropBlur,
  }

  // Dark mode adjustments
  if (isDarkMode) {
    variables['--surface'] = '#0F172A'
    variables['--surface-secondary'] = '#1E293B'
    variables['--surface-tertiary'] = '#334155'
    variables['--text-primary'] = '#F8FAFC'
    variables['--text-secondary'] = '#CBD5E1'
    variables['--text-tertiary'] = '#94A3B8'
    variables['--border-color'] = '#334155'
    variables['--card-background'] = visualStyle === 'glass'
      ? 'rgba(30, 41, 59, 0.8)'
      : '#1E293B'

    // Neumorphic dark mode
    if (visualStyle === 'neumorphic') {
      variables['--card-shadow'] = '8px 8px 16px #0a0f1a, -8px -8px 16px #1e293b'
      variables['--card-shadow-hover'] = '12px 12px 24px #0a0f1a, -12px -12px 24px #1e293b'
      variables['--card-background'] = '#1E293B'
    }
  } else {
    variables['--surface'] = '#FFFFFF'
    variables['--surface-secondary'] = '#F8FAFC'
    variables['--surface-tertiary'] = '#F1F5F9'
    variables['--text-primary'] = '#0F172A'
    variables['--text-secondary'] = '#475569'
    variables['--text-tertiary'] = '#64748B'
    variables['--border-color'] = '#E2E8F0'
  }

  return variables
}

/**
 * Apply theme CSS variables to document root
 */
export function applyThemeToDocument(
  colorTheme: ColorTheme,
  visualStyle: VisualStyle,
  isDarkMode: boolean
): void {
  const variables = generateThemeCSS(colorTheme, visualStyle, isDarkMode)
  const root = document.documentElement

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // Set data attributes for CSS selectors
  root.setAttribute('data-theme', colorTheme)
  root.setAttribute('data-style', visualStyle)
  root.setAttribute('data-mode', isDarkMode ? 'dark' : 'light')
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colorTheme: 'octili',
      visualStyle: 'bento',
      colorMode: 'light',
      isDarkMode: false,

      setColorTheme: (theme) => {
        set({ colorTheme: theme })
        applyThemeToDocument(theme, get().visualStyle, get().isDarkMode)
      },

      setVisualStyle: (style) => {
        set({ visualStyle: style })
        applyThemeToDocument(get().colorTheme, style, get().isDarkMode)
      },

      setColorMode: (mode) => {
        let isDark = false
        if (mode === 'dark') {
          isDark = true
        } else if (mode === 'system') {
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        set({ colorMode: mode, isDarkMode: isDark })
        applyThemeToDocument(get().colorTheme, get().visualStyle, isDark)
      },

      toggleDarkMode: () => {
        const newDarkMode = !get().isDarkMode
        set({
          isDarkMode: newDarkMode,
          colorMode: newDarkMode ? 'dark' : 'light'
        })
        applyThemeToDocument(get().colorTheme, get().visualStyle, newDarkMode)
      },
    }),
    {
      name: 'octili-cashier-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on app load
        if (state) {
          setTimeout(() => {
            applyThemeToDocument(state.colorTheme, state.visualStyle, state.isDarkMode)
          }, 0)
        }
      },
    }
  )
)

// ============================================================================
// STYLE HELPER FUNCTIONS
// ============================================================================

/**
 * Get inline styles for a themed card based on current visual style
 */
export function getThemedCardStyle(
  visualStyle: VisualStyle,
  isDarkMode: boolean,
  isHovered: boolean = false
): React.CSSProperties {
  const style = VISUAL_STYLES[visualStyle]

  const baseStyles: React.CSSProperties = {
    borderRadius: style.borderRadius,
    boxShadow: isHovered ? style.cardShadowHover : style.cardShadow,
    border: style.cardBorder,
    background: isDarkMode
      ? (visualStyle === 'glass' ? 'rgba(30, 41, 59, 0.8)' : '#1E293B')
      : style.cardBackground,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  if (visualStyle === 'glass') {
    baseStyles.backdropFilter = style.backdropBlur
    baseStyles.WebkitBackdropFilter = style.backdropBlur
  }

  if (visualStyle === 'neumorphic' && isDarkMode) {
    baseStyles.boxShadow = isHovered
      ? '12px 12px 24px #0a0f1a, -12px -12px 24px #334155'
      : '8px 8px 16px #0a0f1a, -8px -8px 16px #334155'
  }

  return baseStyles
}

/**
 * Get inline styles for a themed button
 */
export function getThemedButtonStyle(
  colorTheme: ColorTheme,
  visualStyle: VisualStyle,
  variant: 'primary' | 'secondary' | 'ghost' = 'primary'
): React.CSSProperties {
  const colors = COLOR_THEMES[colorTheme]
  const style = VISUAL_STYLES[visualStyle]

  if (variant === 'primary') {
    return {
      background: colors.gradient,
      color: 'white',
      border: 'none',
      borderRadius: style.borderRadius,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: visualStyle === 'bold'
        ? `4px 4px 0 ${colors.colors[700]}`
        : `0 4px 12px ${colors.colors[500]}40`,
    }
  }

  if (variant === 'secondary') {
    return {
      background: colors.colors[50],
      color: colors.colors[700],
      border: visualStyle === 'bold' ? `2px solid ${colors.colors[600]}` : 'none',
      borderRadius: style.borderRadius,
      fontWeight: 600,
      cursor: 'pointer',
    }
  }

  return {
    background: 'transparent',
    color: colors.colors[600],
    border: 'none',
    borderRadius: style.borderRadius,
    fontWeight: 600,
    cursor: 'pointer',
  }
}

/**
 * Get surface colors based on dark mode
 */
export function getSurfaceColors(isDarkMode: boolean) {
  return isDarkMode
    ? {
        surface: '#0F172A',
        surfaceSecondary: '#1E293B',
        surfaceTertiary: '#334155',
        textPrimary: '#F8FAFC',
        textSecondary: '#CBD5E1',
        textTertiary: '#94A3B8',
        border: '#334155',
      }
    : {
        surface: '#FFFFFF',
        surfaceSecondary: '#F8FAFC',
        surfaceTertiary: '#F1F5F9',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        textTertiary: '#64748B',
        border: '#E2E8F0',
      }
}
