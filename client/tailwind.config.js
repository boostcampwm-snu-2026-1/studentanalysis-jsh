/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#476274',
        'primary-container': '#b3cfe5',
        'on-primary': '#ffffff',
        'on-primary-container': '#3e596b',
        surface: '#f9f9f9',
        'surface-dim': '#dadada',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f3f3',
        'surface-container': '#eeeeee',
        'surface-container-high': '#e8e8e8',
        'on-surface': '#1a1c1c',
        'on-surface-variant': '#42474c',
        'inverse-surface': '#2f3131',
        'inverse-on-surface': '#f1f1f1',
        outline: '#73787c',
        'outline-variant': '#c2c7cc',
        secondary: '#5f5e5e',
        'secondary-container': '#e2dfde',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        sans: ['Montserrat', 'Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
}
