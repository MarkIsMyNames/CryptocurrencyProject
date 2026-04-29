export const theme = {
  colors: {
    backgroundPage: '#0f1117',
    backgroundCard: '#1a1d27',
    backgroundInput: '#23273a',
    backgroundOverlay: 'rgba(0, 0, 0, 0.6)',

    brandPrimary: '#4f46e5',
    brandPrimaryHover: '#4338ca',
    brandPrimaryDisabled: '#312e81',

    statusSuccess: '#22c55e',
    statusSuccessSubtle: '#0a2e18',
    statusError: '#ef4444',
    statusErrorSubtle: '#3b0000',
    statusWarning: '#f59e0b',
    statusPending: '#3b82f6',

    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textDisabled: '#475569',
    textInverse: '#0f1117',
    textLink: '#818cf8',
    textLinkHover: '#4f46e5',

    borderDefault: '#2e3250',
    borderFocus: '#4f46e5',
    borderError: '#ef4444',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
  },
  fontSizes: {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
} as const

export type Theme = typeof theme
