export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#050816',
        neon: '#7c3aed',
        mystic: '#22d3ee',
        matrix: '#22c55e',
        panel: 'rgba(10, 14, 30, 0.72)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124, 58, 237, 0.25), 0 0 40px rgba(34, 211, 238, 0.12)',
      },
      backgroundImage: {
        grid: `
          linear-gradient(to right, rgba(124,58,237,0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(124,58,237,0.08) 1px, transparent 1px)
        `,
      },
    },
  },
  plugins: [],
}
