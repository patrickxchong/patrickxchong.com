const { DateTime } = require('luxon');
const slugify = require('slugify');
const cleanCSS = require('clean-css');
const sass = require('sass');
const { extname } = require('path');
const inspect = require("util").inspect;

module.exports = {
	/**
	 * Filters
	 * @link https://www.11ty.dev/docs/filters/
	 */

	/**
	 * dateToFormat allows specifiying display format at point of use.
	 * Example in footer: {{ env.BUILD_TIMESTAMP | dateToFormat('yyyy') }} uses .timestamp
	 *  from the _data/env.js export and formats it via dateToFormat.
	 * Another usage example used in layouts: {{ post.date | dateToFormat("LLL dd, yyyy") }}
	 * And finally, example used in /src/posts/posts.json to format the permalink
	 *  when working with old /yyyy/MM/dd/slug format from Wordpress exports
	 */
	dateToFormat: (date, format) => {
		// replace default date with current build date
		if (!date || date.getFullYear() == 1970) {
			date = new Date();
		}
		return DateTime.fromJSDate(date, {
			zone: 'utc',
		}).toFormat(String(format));
	},

	/**
	 // Universal slug filter strips unsafe chars from URLs
	 */
	slugify: (string) => {
		return slugify(string, {
			lower: true,
			replacement: '-',
			remove: /[*+~.·,()'"`´%!?¿:@]/g,
		});
	},

	/**
 * Pass ` | limit(x)` to a Collection loop to limit the number returned
 * Alt = ` | reverse | limit(x)` to return X most recent
 * Took the following filters from
 * @link https://www.youtube.com/watch?v=wV77GwOY22w&feature=share
 */
	limit: (arr, count = 5) => {
		return arr.slice(0, count);
	},

	published: (arr) => {
		return arr.filter((post) => post.data && post.data.status == "published");
	},

	/**
	 * Get Authors from _data/authors.json to use in Post Lists and Detail
	 */
	getAuthor: (authors, key) => {
		let author = authors.filter((a) => a.slug === key)[0];
		return author;
	},

	/**
	 * Get Posts by Author for the Author detail page
	 */
	getPostsByAuthor: (posts, key) => {
		return posts.filter((a) => a.data.author === key);
	},

	getFileExt: (inputPath) => {
		return extname(inputPath);
	},

	compileSass: (code) => {
		const result = sass.renderSync({
			data: code,
			outputStyle: "compressed"
		});
		return result.css.toString();
	},

	/**
	 * Minify and inline CSS per a tip on 11ty: https://www.11ty.dev/docs/quicktips/inline-css/
	 */
	cssmin: (code) => {
		return new cleanCSS({}).minify(code).styles;
	},

	// {{ something | debug | safe }}
	debug: (content) => `<script>
	let data = ${inspect(content)};
	console.log(data);</script>`,

	excerpt: (post) => {
		const content = post.replace(/(<([^>]+)>)/gi, "");
		return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
	}
};
