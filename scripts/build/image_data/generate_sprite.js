const { writeFileSync, readFileSync, unlinkSync } = require("node:fs");
const path = require("path");

const SVGSpriter = require("svg-sprite");

const { getSanityClient } = require("./get_sanity_client");

async function main() {
  const client = getSanityClient();

  const uiIconsRes = await client.fetch(`*[_type == "uiIcon"] {
    title,
    slug,
    image {
      asset->
    }
  }`);
  const uiGraphicsRes = await client.fetch(`*[_type == "uiGraphic"] {
    title,
    slug,
    image {
      asset->
    }
  }`);

  /**
   * uiIconsBySlug -> image-data/ui-icons.json
   * This will enable static types for ui-icons.
   */
  const uiIconsBySlug = uiIconsRes.reduce((acc, cur) => {
    acc[cur.slug.current] = {};
    return acc;
  }, {});
  const uiIconNames = "src/image-data/generated/ui-icons.json";
  writeFileSync(uiIconNames, JSON.stringify(uiIconsBySlug));
  console.log(`✅ UI icon names written to ${uiIconNames}`);

  /**
   * uiGraphicsBySlug -> image-data/ui-graphics.json
   * This will enable static types for ui-graphics.
   */
  const uiGraphicsBySlug = uiGraphicsRes.reduce((acc, cur) => {
    acc[cur.slug.current] = {};
    return acc;
  }, {});
  const uiGraphicsPath = "src/image-data/generated/ui-graphics.json";
  writeFileSync(uiGraphicsPath, JSON.stringify(uiGraphicsBySlug));
  console.log(`✅ UI graphic names written to ${uiGraphicsPath}`);

  const spriterConfig = {
    mode: {
      symbol: { inline: true },
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

  for (const spriteIcon of [...uiIconsRes, ...uiGraphicsRes]) {
    const slug = spriteIcon.slug.current;
    const url = spriteIcon.image.asset.url;
    const svg = (await (await fetch(url)).text())
      .replace(`fill="#000"`, `fill="currentColor"`)
      .replace(`fill="black"`, `fill="currentColor"`);
    const svgPath = `public/images/sprite/${slug}.svg`;
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

  const spritePath = "public/images/sprite/sprite.svg";
  writeFileSync(spritePath, sprite);

  console.log(`✅ SVG Sprite sheet written to ${spritePath}`);
}

main();
