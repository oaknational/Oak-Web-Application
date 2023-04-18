const fs = require("fs");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
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
function writeJsonForTypes({ names, fileName }) {
  const path = writeJson({
    fileName,
    data: names.reduce((acc, cur) => {
      acc[cur] = {};
      return acc;
    }, {}),
  });
  return path;
}

function getPublicSpritePath({ fileName }) {
  return `public/images/sprite/${fileName}`;
}

function getGeneratedImageDataPath({ fileName }) {
  return `src/image-data/generated/${fileName}`;
}

function writeJson({ data, fileName }) {
  const path = getGeneratedImageDataPath({ fileName });
  writeFileSync(path, JSON.stringify(data));
  return path;
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
          return `${file.stem}`;
        },
      },
    },
  };

  const spriter = new SVGSpriter(config);

  return spriter;
}

async function downloadFile({ url, destination }) {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(destination);
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
}

module.exports = {
  fetchSvgAndAddToSprite,
  compileAndWriteSpriteToFile,
  writeJsonForTypes,
  getPublicSpritePath,
  getGeneratedImageDataPath,
  getSpriterInstance,
  downloadFile,
  writeJson,
};
