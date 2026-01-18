/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Distinctive dark canvas system (Linear-inspired but unique)
				canvas: {
					DEFAULT: '#0c0c0e',
					raised: '#141416',
					overlay: '#1c1c1f',
					border: '#2a2a2d'
				},
				// Soft violet accent (not typical blue)
				accent: {
					DEFAULT: '#8b7cf6',
					hover: '#a095f8',
					muted: '#8b7cf620',
					border: '#8b7cf640'
				},
				// Warm ink colors (Notion-inspired warmth)
				ink: {
					DEFAULT: '#f5f4f1',
					muted: '#a8a5a0',
					faint: '#6b6966',
					ghost: '#3d3c3a'
				},
				// Semantic memory color
				memory: {
					DEFAULT: '#f5a623',
					hover: '#f7b84a',
					muted: '#f5a62320',
					border: '#f5a62340'
				},
				// Additional semantic colors
				success: {
					DEFAULT: '#4ade80',
					muted: '#4ade8020',
					border: '#4ade8040'
				},
				warning: {
					DEFAULT: '#fbbf24',
					muted: '#fbbf2420',
					border: '#fbbf2440'
				},
				danger: {
					DEFAULT: '#f87171',
					muted: '#f8717120',
					border: '#f8717140'
				}
			},
			fontFamily: {
				sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace']
			},
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1rem' }],
				sm: ['0.875rem', { lineHeight: '1.25rem' }],
				base: ['0.9375rem', { lineHeight: '1.5rem' }],
				lg: ['1.125rem', { lineHeight: '1.75rem' }],
				xl: ['1.25rem', { lineHeight: '1.875rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }]
			},
			borderRadius: {
				sm: '0.25rem',
				DEFAULT: '0.375rem',
				md: '0.5rem',
				lg: '0.75rem',
				xl: '1rem'
			},
			boxShadow: {
				sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
				DEFAULT: '0 2px 4px 0 rgba(0, 0, 0, 0.4)',
				md: '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
				lg: '0 8px 16px 0 rgba(0, 0, 0, 0.6)',
				xl: '0 12px 24px 0 rgba(0, 0, 0, 0.7)',
				glow: '0 0 20px rgba(139, 124, 246, 0.3)',
				'memory-glow': '0 0 20px rgba(245, 166, 35, 0.3)'
			},
			animation: {
				'fade-in': 'fadeIn 0.2s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'slide-down': 'slideDown 0.3s ease-out',
				'scale-in': 'scaleIn 0.2s ease-out',
				pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				slideDown: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			spacing: {
				18: '4.5rem',
				88: '22rem',
				112: '28rem',
				128: '32rem'
			}
		}
	},
	plugins: []
};
