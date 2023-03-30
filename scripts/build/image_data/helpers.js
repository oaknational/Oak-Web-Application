const { writeFileSync, readFileSync, unlinkSync } = require("node:fs");
const path = require("path");

const SVGSpriter = require("svg-sprite");

async function fetchSvgAndAddToSprite({ url, name, spriter }) {
  const svg = (await (await fetch(url)).text())
    .replace(`fill="#000"`, `fill="currentColor"`)
    .replace(`fill="black"`, `fill="currentColor"`);
  const svgPath = `public/images/sprite/${name}.svg`;
  writeFileSync(path.resolve(svgPath), svg);

  spriter.add(
    path.resolve(svgPath),
    svgPath,
    readFileSync(path.resolve(svgPath), "utf-8")
  );

  unlinkSync(svgPath);
}

function compileAndWriteSpriteToFile({ spriter, path }) {
  let sprite = "";
  spriter.compile((error, result) => {
    if (error) {
      throw error;
    }

    for (const mode in result) {
      for (const resource in result[mode]) {
        sprite += result[mode][resource].contents.toString();
      }
    }
  });

  writeFileSync(path, sprite);
}

/**
 * This function outputs an object keyed by name.
 * Although this is currently only used to derive types for the names, an
 * array of slugs cannot be used cannot be used
 * @see https://github.com/microsoft/TypeScript/issues/32063
 */
function writeJsonForTypes({ names, path }) {
  writeFileSync(
    path,
    JSON.stringify(
      names.reduce((acc, cur) => {
        acc[cur] = {};
        return acc;
      }, {})
    )
  );
}

function getPublicSpritePath({ fileName }) {
  return `public/images/sprite/${fileName}`;
}

function getGeneratedImageDataPath({ fileName }) {
  return `src/image-data/generated/${fileName}`;
}

function getSpriterInstance({ mode }) {
  const config = {
    mode: {
      defs: mode === "defs" ? { inline: true } : undefined,
      symbol: mode === "symbol" ? { inline: true } : undefined,
    },
    shape: {
      id: {
        generator: (_svg, file) => {
          console.log(file.basename);
          console.log(file.stem);

          return `${file.stem}`;
        },
      },
    },
  };

  const spriter = new SVGSpriter(config);

  return spriter;
}

module.exports = {
  fetchSvgAndAddToSprite,
  compileAndWriteSpriteToFile,
  writeJsonForTypes,
  getPublicSpritePath,
  getGeneratedImageDataPath,
  getSpriterInstance,
};
