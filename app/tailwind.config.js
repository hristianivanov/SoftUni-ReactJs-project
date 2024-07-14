/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            white: '#fffffe',
            black: '#2b2c34',
            blue: '#6246ea',
            grey: '#c0c0c0',
            'dark-grey': '#9a9494',
            'light-grey-1': '#eff0f3',
            'light-grey-2': '#e4e5e9',
        },
        shadow: {
            shadow: 'box-shadow: 4px 6px 13px 0px rgba(215, 215, 215, 0.25));'
        },
        extend: {},
        fontFamily: {
            'sans': ['"Plus Jakarta Sans", sans-serif'],
        },
    },
    plugins: [],
}