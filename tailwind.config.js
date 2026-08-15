export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5FB2', // Pink matching the original theme
        'primary-light': '#FF8CC6',
        secondary: '#FFA364',
        accent: '#5CE1E6',
        paper: '#f9f6f0',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        body: ['Lora', 'serif'],
      }
    },
  },
  plugins: [],
}
