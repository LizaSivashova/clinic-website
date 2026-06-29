/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:           '#f1e9da',
        'cream-2':       '#f6efe1',
        paper:           '#fbf7ef',
        ink:             '#2c2823',
        'ink-soft':      '#5b5347',
        'ink-nav':       '#4a443b',
        muted:           '#8a7a64',
        'muted-light':   '#b3a994',
        forest:          '#3a5a40',
        'forest-deep':   '#2c4632',
        'forest-mid':    '#5b8a63',
        terracotta:      '#c0824f',
        'terracotta-deep': '#a86a3a',
        clay:            '#9a4a3a',
        'sage-soft':     '#dde4d7',
        'sage-hatch':    '#e6ebe2',
        wa:              '#25d366',
      },
      fontFamily: {
        display: ['"Suez One"', 'serif'],
        body:    ['"IBM Plex Sans Hebrew"', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card:          '0 10px 30px rgba(44,40,35,.06)',
        'card-raised': '0 24px 60px rgba(44,40,35,.10)',
        'btn-forest':  '0 10px 28px rgba(58,90,64,.30)',
        'btn-forest-lg': '0 14px 34px rgba(58,90,64,.42)',
        'btn-terra':   '0 6px 18px rgba(192,130,79,.32)',
        'btn-terra-lg':'0 10px 26px rgba(192,130,79,.42)',
      },
    },
  },
  plugins: [],
};
