/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        exif: {
          bg: '#0F172A',
          card: '#1E293B',
          accent: '#3B82F6',
          green: '#10B981',
          amber: '#F59E0B',
          purple: '#8B5CF6',
          cli: '#0D1117',
          clitext: '#3FB950',
        },
      },
      fontFamily: {
        mono: ['Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
