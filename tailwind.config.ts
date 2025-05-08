import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontSize: {
				'xs': '14px',
				'sm': '16px',
				'base': '18px',
				'lg': '20px',
				'xl': '22px',
				'2xl': '24px',
				'3xl': '28px',
				'4xl': '32px',
				'5xl': '36px',
				'6xl': '40px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				oracle: {
					dark: '#000000',
					darker: '#0a0a0a',
					card: '#111111',
					highlight: 'rgb(255, 255, 255)',
					glow: 'rgba(255, 255, 255, 0.3)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 3px 1px rgba(255, 255, 255, 0.2)' 
					},
					'50%': { 
						boxShadow: '0 0 5px 2px rgba(255, 255, 255, 0.3)' 
					}
				},
				'slide-up': {
					from: { 
						transform: 'translateY(100px)',
						opacity: '0'
					},
					to: { 
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'fade-in': {
					from: { 
						opacity: '0'
					},
					to: { 
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.5s ease-out forwards',
				'slide-up-delay-1': 'slide-up 0.5s ease-out 0.2s forwards',
				'slide-up-delay-2': 'slide-up 0.5s ease-out 0.3s forwards',
				'slide-up-delay-3': 'slide-up 0.5s ease-out 0.4s forwards',
				'slide-up-delay-4': 'slide-up 0.5s ease-out 0.5s forwards',
				'slide-up-delay-5': 'slide-up 0.5s ease-out 0.6s forwards',
				'fade-in': 'fade-in 1s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
