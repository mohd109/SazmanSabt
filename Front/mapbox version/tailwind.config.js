const customTheme = require('./src/theme');
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
     extend: {...customTheme,
    },
   
  },
  plugins: [],
}