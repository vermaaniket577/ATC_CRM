/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme: Red, White, Orange, Blue, Green
        telecom: {
          // White & Light Canvas
          white: '#FFFFFF',
          canvas: '#F8FAFC',
          surface: '#FFFFFF',
          lightBg: '#F8FAFC',

          // Red Accent (Alerts, Critical SLA, Brand Pulse)
          red: '#EF4444',
          redHover: '#DC2626',
          redLight: '#FEF2F2',
          redBorder: '#FECACA',

          // Orange Accent (Leads, Followups, Tasks, Pipeline)
          orange: '#F97316',
          orangeHover: '#EA580C',
          orangeLight: '#FFF7ED',
          orangeBorder: '#FED7AA',

          // Blue Accent (Primary, Customers, 5G Connections, Plans)
          blue: '#2563EB',
          blueHover: '#1D4ED8',
          blueLight: '#EFF6FF',
          blueBorder: '#BFDBFE',
          primary: '#2563EB',

          // Green Accent (Active Status, Converted Leads, Payments, KYC)
          green: '#10B981',
          greenHover: '#059669',
          greenLight: '#ECFDF5',
          greenBorder: '#A7F3D0',

          // Neutral Light Typography & Borders
          border: '#E2E8F0',
          borderSubtle: '#F1F5F9',
          textDark: '#0F172A',
          textMuted: '#64748B',

          // Aliases mapped to clean light mode for compatibility
          darkest: '#F8FAFC',
          navy: '#FFFFFF',
          sidebar: '#FFFFFF',
          sidebarHover: '#F8FAFC',
          accent: '#F97316',
          highlight: '#2563EB',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'premium': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.25)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.25)',
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.25)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
