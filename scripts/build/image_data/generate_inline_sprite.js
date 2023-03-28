const { writeFileSync, readFileSync, unlinkSync } = require("node:fs");
const path = require("path");

const SVGSpriter = require("svg-sprite");

const { getSanityClient } = require("./get_sanity_client");

async function main() {
  const client = getSanityClient();

  const [inlineSpriteAssetRes] = await client.fetch(`*[_type == "brandAsset"] {
    logoWithText {
      image {
        asset->
      }
    },
  }`);

  const { logoWithText } = inlineSpriteAssetRes;

  const assetsByName = {
    "logo-with-text": logoWithText,
  };

  /**
   * assetsByName -> image-data/inline-sprite.json
   * This will enable static types for InlineSpriteSvg.
   */
  const jsonPath = "src/image-data/generated/inline-sprite.json";
  writeFileSync(
    jsonPath,
    JSON.stringify(
      Object.keys(assetsByName).reduce((acc, cur) => {
        acc[cur] = {};
        return acc;
      }, {})
    )
  );
  console.log(`✅ Inline sprite asset names written to ${jsonPath}`);

  const spriterConfig = {
    mode: {
      // defs mode required in order for SVGR to work
      defs: { inline: true },
    },
    shape: {
      id: {
        generator: (_svg, file) => {
          return `${file.stem}`;
        },
      },
    },
  };
  const spriter = new SVGSpriter(spriterConfig);

  for (const [name, asset] of Object.entries(assetsByName)) {
    const url = asset.image.asset.url;
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

  const spritePath = "src/image-data/generated/inline-sprite.svg";
  writeFileSync(spritePath, sprite);

  console.log(`✅ SVG inline sprite sheet written to ${spritePath}`);
}

main();
