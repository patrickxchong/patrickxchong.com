
module.exports = {
	markdown: (content, classes = "") => {
		if (!content) return "";

		let markdownIt = require("./markdownIt");

		return `
		<link rel="stylesheet" href="/assets/css/markdown.css"/>
		<div class="markdown ${classes}">
			${markdownIt.render(content)}
		</div>`;
	},
	callout: (content) => {
		return `<section class="py-4 border-t-4 border-b-4 sm:py-6 mt-12 mb-12">
<p class="m-0 font-bold text-center sm:text-xl">${content}</p>
</section>`;
	}
};
