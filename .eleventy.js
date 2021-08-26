require('dotenv').config();
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const svgSprite = require('eleventy-plugin-svg-sprite');
// const svgSprite = require('../../11ty/eleventy-plugin-svg-sprite');

const collections = require('./utils/collections.js');
const filters = require('./utils/filters.js');
const shortcodes = require('./utils/shortcodes.js');
const pairedshortcodes = require('./utils/paired-shortcodes.js');
const transforms = require('./utils/transforms.js');
const image = require('./utils/image');

const isDev = process.env.NODE_ENV === "development";
// fs.utimes('.eleventy.js', new Date(), new Date(), ()=>{})

module.exports = function (eleventyConfig) {
	/**
	 * beforeBuild hook
	 * @link https://www.11ty.dev/docs/events/#beforebuild
	 */
	// eleventyConfig.on('beforeBuild', require("./utils/beforeBuild"));

	/**
	 * Plugins
	 * @link https://www.11ty.dev/docs/plugins/
	 */
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(svgSprite, {
		path: "./src/assets/svg",
		globalClasses: "svgicon fill-current",
		defaultClasses: "h-4 w-4 text-black inline"
	});

	/**
	 * Filters
	 * @link https://www.11ty.io/docs/filters/
	 */
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName]);
	});

	/**
	 * Transforms
	 * @link https://www.11ty.io/docs/config/#transforms
	 */
	Object.keys(transforms).forEach((transformName) => {
		eleventyConfig.addTransform(transformName, transforms[transformName]);
	});

	/**
	 * Shortcodes
	 * @link https://www.11ty.io/docs/shortcodes/
	 */
	Object.keys(shortcodes).forEach((shortcodeName) => {
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
	});
	eleventyConfig.addShortcode('img', image);

	/**
	 * Paired Shortcodes
	 * @link https://www.11ty.dev/docs/languages/nunjucks/#paired-shortcode
	 */
	Object.keys(pairedshortcodes).forEach((shortcodeName) => {
		eleventyConfig.addPairedShortcode(
			shortcodeName,
			pairedshortcodes[shortcodeName]
		);
	});


	/**
	 * Collections
	 */
	Object.keys(collections).forEach((collectionName) => {
		eleventyConfig.addCollection(collectionName, collections[collectionName]);
	});

	/**
	 * Custom Watch Targets
	 * for when the Tailwind config or .css files change...
	 * by default not watched by 11ty
	 * @link https://www.11ty.dev/docs/config/#add-your-own-watch-targets
	 */
	eleventyConfig.addWatchTarget('./src/assets');
	eleventyConfig.addWatchTarget('./utils/*.js');
	eleventyConfig.addWatchTarget('./tailwind.config.js');

	/**
	 * Ignore files (only ships in 11ty V1)
	 * @link https://www.11ty.dev/docs/copy/
	 * @link https://www.11ty.dev/docs/ignores/#configuration-api
	 */
	// eleventyConfig.ignores.add("README.md");
	// eleventyConfig.ignores.add("**/posts/*");
	// eleventyConfig.ignores.add("**/_*.md");

	/**
	 * Passthrough File Copy
	 * @link https://www.11ty.dev/docs/copy/
	 */
	eleventyConfig.addPassthroughCopy('src/*.png');
	eleventyConfig.addPassthroughCopy('src/*.jpg');
	eleventyConfig.addPassthroughCopy('src/*.ico');
	eleventyConfig.addPassthroughCopy('src/robots.txt');
	eleventyConfig.addPassthroughCopy('src/assets/images/');
	eleventyConfig.addPassthroughCopy('src/assets/svg/');
	eleventyConfig.addPassthroughCopy('src/assets/video/');
	eleventyConfig.addPassthroughCopy('src/assets/css/*.css');

	if (isDev) {
		// enable Netlify CMS only in development
		eleventyConfig.addPassthroughCopy('src/admin/*');
	}

	/**
	 * Set custom markdown library instance
	 * @link https://www.11ty.dev/docs/languages/markdown/#optional-set-your-own-library-instance
	 */
	eleventyConfig.setLibrary('md', require("./utils/markdownIt"));

	/**
	 * Add layout aliases
	 * @link https://www.11ty.dev/docs/layouts/#layout-aliasing
	 */
	// eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
	// eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');
	// eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');
	// eleventyConfig.addLayoutAlias('author', 'layouts/author.njk');

	/**
	 * Opts in to a full deep merge when combining the Data Cascade.
	 * Per the link below, "This will likely become the default in an upcoming major version."
	 * So I'm going to implement it now.
	 * @link https://www.11ty.dev/docs/data-deep-merge/#data-deep-merge
	 */
	eleventyConfig.setDataDeepMerge(true);

	/**
	 * Override BrowserSync Server options
	 * This so we can have and test a 404 during local dev.
	 * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
	 */
	// eleventyConfig.setBrowserSyncConfig({
	// 	notify: true,
	// 	snippetOptions: {
	// 		rule: {
	// 			match: /<\/head>/i,
	// 			fn: function (snippet, match) {
	// 				return snippet + match
	// 			},
	// 		},
	// 	},
	// Set local server 404 fallback
	// callbacks: {
	// 	ready: function (err, browserSync) {
	// 		const content_404 = fs.readFileSync('dist/404.html')

	// 		browserSync.addMiddleware('*', (req, res) => {
	// 			// Provides the 404 content without redirect.
	// 			res.write(content_404)
	// 			res.end()
	// 		})
	// 	},
	// },
	// })

	return {
		dir: {
			input: 'src',
			output: 'dist',
			includes: '_includes',
			data: '_data',
		},
		passthroughFileCopy: true,
		templateFormats: ['html', 'njk', 'md'],
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
	};
};
