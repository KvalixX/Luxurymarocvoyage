import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Moroccan primary palette
        terracotta: {
          50:  '#fdf4f0',
          100: '#fbe5db',
          200: '#f7c9b5',
          300: '#f1a588',
          400: '#e97a55',
          500: '#DF6951', // Brand primary
          600: '#c94e38',
          700: '#a83d2c',
          800: '#883329',
          900: '#6f2d25',
          950: '#3c1510',
        },
        sand: {
          50:  '#fdf9f0',
          100: '#f9efda',
          200: '#f2ddb3',
          300: '#e9c580',
          400: '#dfa84c',
          500: '#C9963C', // Gold accent
          600: '#b07a2e',
          700: '#8e5f24',
          800: '#734c21',
          900: '#5f3f1d',
          950: '#33200d',
        },
        majorelle: {
          50:  '#eef2ff',
          100: '#e0e8ff',
          200: '#c7d4ff',
          300: '#a4b8ff',
          400: '#7e93ff',
          500: '#5B6CF9',
          600: '#4045f0', // Majorelle blue
          700: '#3432d6',
          800: '#2b2aad',
          900: '#282988',
          950: '#191851',
        },
        morocco: {
          dark: '#1A0F0A',
          charcoal: '#2D1F17',
          warm: '#F7F0E6',
          cream: '#FDF8F2',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-moroccan': 'linear-gradient(135deg, #DF6951 0%, #C9963C 50%, #5B6CF9 100%)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(26,15,10,0.2) 0%, rgba(26,15,10,0.7) 100%)',
        'gradient-card': 'linear-gradient(to bottom, transparent 40%, rgba(26,15,10,0.9) 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FDF8F2 0%, #F7F0E6 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'card': '0 4px 24px -4px rgba(26,15,10,0.12), 0 2px 8px -2px rgba(26,15,10,0.08)',
        'card-hover': '0 12px 40px -8px rgba(223,105,81,0.25), 0 4px 16px -4px rgba(26,15,10,0.12)',
        'glass': '0 8px 32px rgba(26,15,10,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glow': '0 0 40px rgba(223,105,81,0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2D1F17',
            a: { color: '#DF6951', '&:hover': { color: '#c94e38' } },
            h1: { fontFamily: 'var(--font-cormorant)', color: '#1A0F0A' },
            h2: { fontFamily: 'var(--font-cormorant)', color: '#1A0F0A' },
            h3: { fontFamily: 'var(--font-cormorant)', color: '#2D1F17' },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
