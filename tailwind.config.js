/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Linear theme - Background colors
        background: {
          primary: '#08090a',
          secondary: '#0f1011',
          tertiary: '#141516',
          quaternary: '#191a1b',
          marketing: '#010102',
        },
        
        // Linear theme - Text colors
        text: {
          primary: '#f7f8f8',
          secondary: '#d0d6e0',
          tertiary: '#8a8f98',
          quaternary: '#62666d',
        },
        
        // Linear theme - Brand colors
        brand: {
          DEFAULT: '#5e6ad2',
          primary: '#5e6ad2',
          accent: '#7b84e3',
          'accent-hover': '#828fff',
          text: '#fff',
          background: '#5e6ad2',
        },
        
        // Linear theme - Border colors
        border: {
          DEFAULT: '#23252a',
          primary: '#23252a',
          secondary: '#34343a',
          tertiary: '#3e3e44',
          translucent: 'hsla(0,0%,100%,.05)',
        },
        
        // Linear theme - Line colors
        lines: {
          primary: '#37393a',
          secondary: '#202122',
          tertiary: '#18191a',
          quaternary: '#141515',
          tint: '#141516',
        },
        
        // Linear theme - Status colors
        status: {
          success: '#4cb782',
          successLight: 'rgba(76, 183, 130, 0.1)',
          error: '#eb5757',
          errorLight: 'rgba(235, 87, 87, 0.1)',
          warning: '#fc7840',
          warningLight: 'rgba(252, 120, 64, 0.1)',
          info: '#4ea7fc',
          infoLight: 'rgba(78, 167, 252, 0.1)',
          red: '#eb5757',
          orange: '#fc7840',
          yellow: '#f2c94c',
          green: '#4cb782',
          blue: '#4ea7fc',
          indigo: '#5e6ad2',
          'linear-plan': '#68cc58',
          'linear-security': '#7a7fad',
          'linear-build': '#d4b144',
        },
      },
      
      fontFamily: {
        sans: ['"Inter Variable"', '"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Roboto"', '"Oxygen"', '"Ubuntu"', '"Cantarell"', '"Open Sans"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"Berkeley Mono"', 'ui-monospace', '"SF Mono"', '"Menlo"', 'monospace'],
        serif: ['"Tiempos Headline"', 'ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      
      fontSize: {
        'micro': ['0.6875rem', '1.4'],
        'mini': ['0.75rem', '1.5'],
        'small': ['0.8125rem', 'calc(21 / 14)'],
        'regular': ['0.9375rem', '1.6'],
        'large': ['1.0625rem', '1.6'],
        'title-1': ['1.0625rem', '1.4'],
        'title-2': ['1.3125rem', '1.33'],
        'title-3': ['1.5rem', '1.33'],
        'title-4': ['2rem', '1.125'],
        'title-5': ['2.5rem', '1.1'],
        'title-6': ['3rem', '1.1'],
        'title-7': ['3.5rem', '1.1'],
        'title-8': ['4rem', '1.06'],
        'title-9': ['4.5rem', '1'],
      },
      
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '510',
        semibold: '590',
        bold: '680',
      },
      
      borderRadius: {
        'none': '0',
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      
      boxShadow: {
        'none': '0px 0px 0px transparent',
        'tiny': '0px 0px 0px transparent',
        'low': '0px 2px 4px rgba(0,0,0,.1)',
        'medium': '0px 4px 24px rgba(0,0,0,.2)',
        'high': '0px 7px 32px rgba(0,0,0,.35)',
        'stack': '0px 8px 2px 0px transparent,0px 5px 2px 0px rgba(0,0,0,.01),0px 3px 2px 0px rgba(0,0,0,.04),0px 1px 1px 0px rgba(0,0,0,.07),0px 0px 1px 0px rgba(0,0,0,.08)',
      },
      
      transitionDuration: {
        'quick': '100ms',
        'regular': '250ms',
      },
      
      transitionTimingFunction: {
        'in-quad': 'cubic-bezier(0.55,0.085,0.68,0.53)',
        'out-quad': 'cubic-bezier(0.25,0.46,0.45,0.94)',
        'in-out-quad': 'cubic-bezier(0.455,0.03,0.515,0.955)',
        'in-cubic': 'cubic-bezier(0.55,0.055,0.675,0.19)',
        'out-cubic': 'cubic-bezier(0.215,0.61,0.355,1)',
        'in-out-cubic': 'cubic-bezier(0.645,0.045,0.355,1)',
        'in-quart': 'cubic-bezier(0.895,0.03,0.685,0.22)',
        'out-quart': 'cubic-bezier(0.165,0.84,0.44,1)',
        'in-out-quart': 'cubic-bezier(0.77,0,0.175,1)',
        'in-quint': 'cubic-bezier(0.755,0.05,0.855,0.06)',
        'out-quint': 'cubic-bezier(0.23,1,0.32,1)',
        'in-out-quint': 'cubic-bezier(0.86,0,0.07,1)',
        'in-expo': 'cubic-bezier(0.95,0.05,0.795,0.035)',
        'out-expo': 'cubic-bezier(0.19,1,0.22,1)',
        'in-out-expo': 'cubic-bezier(1,0,0,1)',
        'in-circ': 'cubic-bezier(0.6,0.04,0.98,0.335)',
        'out-circ': 'cubic-bezier(0.075,0.82,0.165,1)',
        'in-out-circ': 'cubic-bezier(0.785,0.135,0.15,0.86)',
      },
      
      zIndex: {
        'footer': '50',
        'scrollbar': '75',
        'header': '100',
        'overlay': '500',
        'popover': '600',
        'command-menu': '650',
        'dialog-overlay': '699',
        'dialog': '700',
        'toasts': '800',
        'tooltip': '1100',
        'context-menu': '1200',
        'skip-nav': '5000',
        'debug': '5100',
        'max': '10000',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin': 'spin 1s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(147, 51, 234, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}