module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#f4f4f5',
        card: {
          DEFAULT: '#121215',
          border: '#27272a',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
        kick: '#53fc18',
        twitch: '#9146ff',
        youtube: '#ff0000',
      },
    },
  },
  plugins: [],
};
