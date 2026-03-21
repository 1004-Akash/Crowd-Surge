/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['0.9375rem', { lineHeight: '1.5rem' }],
                'lg': ['1.0625rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1.1' }],
            },
            colors: {
                // Premium Dark Theme
                background: {
                    DEFAULT: '#09090b',
                    secondary: '#0c0c0f',
                    tertiary: '#141419',
                    elevated: '#1a1a21',
                    hover: '#1f1f27',
                },
                border: {
                    DEFAULT: '#1f1f28',
                    hover: '#2a2a35',
                    subtle: '#16161d',
                    accent: '#06b6d4',
                },
                foreground: {
                    DEFAULT: '#fafafa',
                    secondary: '#a1a1aa',
                    muted: '#71717a',
                    subtle: '#52525b',
                },
                accent: {
                    DEFAULT: '#06b6d4',
                    hover: '#0891b2',
                    light: '#22d3ee',
                    muted: '#164e63',
                    glow: 'rgba(6, 182, 212, 0.5)',
                },
                purple: {
                    DEFAULT: '#a855f7',
                    hover: '#9333ea',
                    muted: '#581c87',
                    glow: 'rgba(168, 85, 247, 0.5)',
                },
                success: {
                    DEFAULT: '#10b981',
                    muted: '#064e3b',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    muted: '#78350f',
                },
                danger: {
                    DEFAULT: '#ef4444',
                    muted: '#7f1d1d',
                },
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            borderRadius: {
                DEFAULT: '0.625rem',
                'sm': '0.375rem',
                'md': '0.5rem',
                'lg': '0.75rem',
                'xl': '1rem',
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                'xs': '0 1px 2px 0 rgb(0 0 0 / 0.25)',
                'sm': '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
                'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
                'md': '0 6px 12px -2px rgb(0 0 0 / 0.35), 0 3px 6px -3px rgb(0 0 0 / 0.35)',
                'lg': '0 12px 24px -4px rgb(0 0 0 / 0.4), 0 6px 12px -6px rgb(0 0 0 / 0.4)',
                'xl': '0 20px 40px -8px rgb(0 0 0 / 0.5)',
                '2xl': '0 32px 64px -12px rgb(0 0 0 / 0.6)',
                'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
                'glow-sm': '0 0 12px rgba(6, 182, 212, 0.25)',
                'glow': '0 0 24px rgba(6, 182, 212, 0.3)',
                'glow-lg': '0 0 40px rgba(6, 182, 212, 0.35)',
                'glow-purple': '0 0 24px rgba(168, 85, 247, 0.3)',
                'glow-success': '0 0 16px rgba(16, 185, 129, 0.4)',
                'glow-danger': '0 0 16px rgba(239, 68, 68, 0.4)',
                'card': '0 0 0 1px rgba(255, 255, 255, 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 6px 16px -4px rgb(0 0 0 / 0.3)',
                'card-hover': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 24px -4px rgb(0 0 0 / 0.4)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-mesh': 'radial-gradient(at 27% 37%, hsla(188, 85%, 50%, 0.08) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(270, 85%, 60%, 0.06) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(188, 85%, 50%, 0.05) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(270, 85%, 60%, 0.04) 0px, transparent 50%)',
                'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                'shine': 'linear-gradient(115deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%, transparent 100%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.4s ease-out forwards',
                'slide-in-right': 'slideInRight 0.4s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'float': 'float 8s ease-in-out infinite',
                'spin-slow': 'spin 12s linear infinite',
                'gradient-shift': 'gradientShift 8s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)' },
                    '50%': { boxShadow: '0 0 28px rgba(6, 182, 212, 0.6)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '33%': { transform: 'translateY(-8px) rotate(1deg)' },
                    '66%': { transform: 'translateY(4px) rotate(-1deg)' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [],
}
