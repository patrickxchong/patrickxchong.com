module.exports = {
	// mode: 'jit',
	purge: [
		'./src/**/*.html',
		'./src/**/*.njk',
		'./src/**/*.md',
		'./public/admin/config.yml',
		'./utils/*.js',
		'./.eleventy.js'
	],
	variants: {}
};
