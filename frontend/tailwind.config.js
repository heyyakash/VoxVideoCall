/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily:{
        'm':'Montserrat',
        'logo':'Pacifico'
      },
      backgroundColor:{
        'prim':"#252525",
        'sec':'#FA7268',
        'tert':"#C62368"
      },
      colors:{
        'prim':"#252525",
        'sec':'#FA7268',
        "tert":"#C62368"
      }
    },
  },
  plugins: [],
}
