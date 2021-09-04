const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

module.exports = {
	purge: ['./**/*.css', './{pages,components}/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				gray: colors.gray,
				pace: {
					green: '#84BB27',
					raisin: '#202030',
					violet: '#39304A',
					grey: '#5a5a5a',
				},
			},
		},
	},
	plugins: [require('tailwindcss-safe-area')],
};
