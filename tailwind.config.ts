import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#f6f7f9',
          surface: '#ffffff',
          ink: '#0d1526',
          muted: '#5b6474',
          hairline: 'rgba(13,21,38,0.10)',
          'hairline-strong': 'rgba(13,21,38,0.20)',
          accent: '#0f766e',
          'accent-strong': '#115e59',
          link: '#2563eb',
          dark: '#0b1220',
          success: '#15803d',
          warn: '#b45309',
          error: '#b91c1c',
        },
      },
      fontFamily: {
        display: [
          'var(--font-space-grotesk)',
          'var(--font-inter)',
          'var(--font-noto-sans-jp)',
          'sans-serif',
        ],
        body: [
          'var(--font-inter)',
          'var(--font-noto-sans-jp)',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'var(--font-ibm-plex-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
        ],
      },
      borderRadius: {
        card: '12px',
        btn: '10px',
        chip: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(13,21,38,.05), 0 8px 24px rgba(13,21,38,.06)',
        hover: '0 2px 4px rgba(13,21,38,.06), 0 16px 40px rgba(13,21,38,.10)',
      },
    },
  },
  plugins: [],
};

export default config;
