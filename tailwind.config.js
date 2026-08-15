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
        primary: '#DC2626', // Bendera Merah
        'primary-dark': '#991B1B',
        'primary-light': '#EF4444',
        secondary: '#18181B', // Obsidian Black
        paper: '#FDFBF7', // Vintage Parchment
        'paper-dark': '#F4EFE6',
        gold: '#F59E0B',
        'gold-light': '#FEF08A',
        accent: '#DC2626',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'brutal-sm': '3px 3px 0px 0px #000',
        'brutal': '6px 6px 0px 0px #000',
        'brutal-lg': '10px 10px 0px 0px #000',
        'brutal-red': '6px 6px 0px 0px #DC2626',
        'brutal-gold': '6px 6px 0px 0px #F59E0B',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      }
    },
  },
  plugins: [],
}
