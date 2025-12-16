/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right, #3b82f6, #22c55e)'
      },
      colors: {
        brand: {
          blue: '#3b82f6',
          green: '#22c55e'
        }
      }
    }
  },
  plugins: []
}
