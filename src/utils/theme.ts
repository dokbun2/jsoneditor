export const theme = {
  colors: {
    background: {
      primary: '#08090a',
      secondary: '#0f1011',
      tertiary: '#141516',
      quaternary: '#191a1b',
      elevated: '#1e1f21',
      overlay: 'rgba(0, 0, 0, 0.5)',
      marketing: '#010102',
    },
    text: {
      primary: '#f7f8f8',
      secondary: '#b8bcc5',
      tertiary: '#8a8f98',
      quaternary: '#62666d',
      muted: '#4a4e55',
      inverse: '#08090a',
    },
    brand: {
      primary: '#5e6ad2',
      accent: '#7b84e3',
      light: '#9ba3ec',
      dark: '#4854b4',
      accentHover: '#828fff',
      text: '#ffffff',
      background: '#5e6ad2',
      gradient: 'linear-gradient(135deg, #5e6ad2 0%, #a855f7 100%)',
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.08)',
      secondary: 'rgba(255, 255, 255, 0.12)',
      tertiary: 'rgba(255, 255, 255, 0.16)',
      subtle: 'rgba(255, 255, 255, 0.04)',
      translucent: 'rgba(255, 255, 255, 0.05)',
      focus: '#5e6ad2',
    },
    status: {
      success: '#4cb782',
      successLight: 'rgba(76, 183, 130, 0.1)',
      error: '#eb5757',
      errorLight: 'rgba(235, 87, 87, 0.1)',
      warning: '#fc7840',
      warningLight: 'rgba(252, 120, 64, 0.1)',
      info: '#4ea7fc',
      infoLight: 'rgba(78, 167, 252, 0.1)',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
    '4xl': '6rem',  // 96px
    '5xl': '8rem',  // 128px
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
    md: '0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(94, 106, 210, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  transitions: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;