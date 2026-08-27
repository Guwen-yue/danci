import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './content/**/*.mdx', './public/**/*.svg'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F2E9',
        card: '#FFFFFF',
        ink: {
          DEFAULT: '#2B261F',
          soft: '#6E6557',
          faint: '#A79C8C',
        },
        accent: {
          DEFAULT: '#E4572E',
          deep: '#C2441F',
          soft: '#FBE7DC',
        },
        teal: '#1F8A70',
        line: '#EAE2D2',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          'sans-serif',
        ],
        display: ['Georgia', '"Songti SC"', '"STSong"', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(43,38,31,0.04), 0 10px 28px -14px rgba(43,38,31,0.14)',
        float: '0 20px 48px -16px rgba(43,38,31,0.22)',
        accent: '0 12px 24px -10px rgba(228,87,46,0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'card-in': {
          '0%': { opacity: '0', transform: 'translateX(28px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        'card-out': {
          '0%': { opacity: '1', transform: 'translateX(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(-28px) scale(0.98)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.24s cubic-bezier(0.22, 1, 0.36, 1) both',
        'card-in': 'card-in 0.32s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.2s ease-out both',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;
