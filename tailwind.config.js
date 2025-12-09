/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px',
  		'2xl': '1536px',
  		'3xl': '1920px',
  		'4xl': '2560px'
  	},
  	extend: {
  		colors: {
  			primary: {
  				'50': '#eff6ff',
  				'100': '#dbeafe',
  				'200': '#bfdbfe',
  				'300': '#93c5fd',
  				'400': '#60a5fa',
  				'500': '#3b82f6',
  				'600': '#2563eb',
  				'700': '#1d4ed8',
  				'800': '#1e40af',
  				'900': '#1e3a8a',
  				'950': '#172554',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			navy: {
  				'800': '#1e293b',
  				'900': '#0f172a',
  				'950': '#020617'
  			},
  			success: {
  				'50': '#f0fdf4',
  				'100': '#dcfce7',
  				'500': '#22c55e',
  				'600': '#16a34a',
  				'700': '#15803d'
  			},
  			warning: {
  				'50': '#fffbeb',
  				'100': '#fef3c7',
  				'500': '#f59e0b',
  				'600': '#d97706'
  			},
  			destructive: {
  				'50': '#fef2f2',
  				'100': '#fee2e2',
  				'500': '#ef4444',
  				'600': '#dc2626',
  				'700': '#b91c1c',
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			'display-1': [
  				'3rem',
  				{
  					lineHeight: '1.1',
  					letterSpacing: '-0.02em',
  					fontWeight: '700'
  				}
  			],
  			'display-2': [
  				'2.25rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.01em',
  					fontWeight: '600'
  				}
  			],
  			h1: [
  				'1.875rem',
  				{
  					lineHeight: '1.25',
  					letterSpacing: '-0.01em',
  					fontWeight: '600'
  				}
  			],
  			h2: [
  				'1.5rem',
  				{
  					lineHeight: '1.3',
  					fontWeight: '600'
  				}
  			],
  			h3: [
  				'1.25rem',
  				{
  					lineHeight: '1.4',
  					fontWeight: '600'
  				}
  			],
  			h4: [
  				'1.125rem',
  				{
  					lineHeight: '1.4',
  					fontWeight: '500'
  				}
  			],
  			'body-lg': [
  				'1rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			body: [
  				'0.875rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			'body-sm': [
  				'0.8125rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			caption: [
  				'0.75rem',
  				{
  					lineHeight: '1.4'
  				}
  			]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'22': '5.5rem'
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			DEFAULT: '0.375rem',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)'
  		},
  		boxShadow: {
  			sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			card: '0 1px 3px 0 rgb(0 0 0 / 0.08)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
