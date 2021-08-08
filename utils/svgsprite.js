const fs = require('fs');
const path = require('path');
const util = require('util');
const glob = require('glob');
const File = require('vinyl');
const SVGSpriter = require('svg-sprite');

// add path to where you store SVGs
const cwd = path.resolve('src/assets/svg');
const spriteConfig = {
	mode: {
		inline: true,
		symbol: {
			sprite: 'sprite.svg',
			example: false,
		},
	},
	shape: {
		transform: ['svgo'],
		id: {
			generator: 'symbol-%s',
		},
	},
	svg: {
		xmlDeclaration: false,
		doctypeDeclaration: false,
	},
};

// placeholder variable to populate with spriteContent
let spriteContent = null;
let cacheKey = "";

module.exports = async () => {
	// Get all SVG files in working directory
	const getFiles = util.promisify(glob);
	const files = await getFiles('**/*.svg', { cwd: cwd });
	const newCacheKey = files.map(file => `${file}:${fs.statSync(`src/assets/svg/${file}`).mtimeMs}`).join("|");

	if (spriteContent && newCacheKey === cacheKey) {
		return spriteContent;
	} else {
		console.log("Build spriteContent");
		cacheKey = newCacheKey;
	}

	// Make a new SVGSpriter instance w/ configuration
	const spriter = new SVGSpriter(spriteConfig);

	// Add them all to the spriter
	files.forEach(function (file) {
		spriter.add(
			new File({
				path: path.join(cwd, file),
				base: cwd,
				contents: fs.readFileSync(path.join(cwd, file)),
			})
		);
	});

	// Wrap spriter compile function in a Promise
	const compileSprite = async (args) => {
		return new Promise((resolve, reject) => {
			spriter.compile(args, (error, result) => {
				if (error) {
					return reject(error);
				}
				resolve(result.symbol.sprite);
			});
		});
	};

	// Compile the sprite file and return it as a string
	const sprite = await compileSprite(spriteConfig.mode);
	// cache as global variable
	spriteContent = sprite.contents.toString('utf8');
	return spriteContent;
};
