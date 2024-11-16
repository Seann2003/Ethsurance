import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            sans: ['Adelle Sans', ...defaultTheme.fontFamily.sans],
          },
          colors: {
            'privy-navy': '#160B45',
            'privy-light-blue': '#EFF1FD',
            'privy-blueish': '#D4D9FC',
            'privy-pink': '#FF8271',
            'privy-violet': '#6D28D9',
            'privy-dark-grey': '#1b1b1f'
          },
    },
  },
  plugins: [],
} as const;
