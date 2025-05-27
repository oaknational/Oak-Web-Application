const fs = require("fs");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const { writeFile, readFile, unlink } = require("fs/promises");
const path = require("path");

const SVGSpriter = require("svg-sprite");

async function fetchSvgAndAddToSprite({ url, name, spriter }) {
  const svg = (await (await fetch(url)).text())
    .replace(`fill="#000"`, `fill="currentColor"`)
    .replace(`fill="black"`, `fill="currentColor"`);
  const svgPath = `public/images/sprite/${name}.svg`;
  await writeFile(path.resolve(svgPath), svg);
  const svgContent = await readFile(path.resolve(svgPath), "utf-8");

  spriter.add(path.resolve(svgPath), svgPath, svgContent);

  await unlink(svgPath);
}

async function compileAndWriteSpriteToFile({ spriter, path }) {
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

  await writeFile(path, sprite);
}

/**
 * This function outputs an object keyed by name.
 * Although this is currently only used to derive types for the names, an
 * array of slugs cannot be used cannot be used
 * @see https://github.com/microsoft/TypeScript/issues/32063
 */
async function writeJsonForTypes({ names, fileName }) {
  const path = await writeJson({
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

async function writeJson({ data, fileName }) {
  const path = getGeneratedImageDataPath({ fileName });
  await writeFile(path, JSON.stringify(data));
  return path;
}

function getSpriterInstance() {
  /** @type {import("svg-sprite").Config} */
  const config = {
    mode: {
      defs: true,
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
