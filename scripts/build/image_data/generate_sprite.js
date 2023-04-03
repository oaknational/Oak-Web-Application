const { getSanityClient } = require("./get_sanity_client");
const {
  fetchSvgAndAddToSprite,
  compileAndWriteSpriteToFile,
  writeJsonForTypes,
  getPublicSpritePath,
  getGeneratedImageDataPath,
  getSpriterInstance,
} = require("./helpers");

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

  function getSlugs({ assets }) {
    return assets.map((asset) => asset.slug.current);
  }

  /**
   * uiIconsBySlug -> image-data/ui-icons.json
   * This will enable static types for ui-icons.
   */
  const uiIconNames = getSlugs({ assets: uiIconsRes });
  const uiIconsPath = getGeneratedImageDataPath({ fileName: "ui-icons.json" });
  writeJsonForTypes({
    names: uiIconNames,
    path: getGeneratedImageDataPath({ fileName: "ui-icons.json" }),
  });
  console.log(`✅ UI icon names written to ${uiIconsPath}`);

  /**
   * uiGraphicsBySlug -> image-data/ui-graphics.json
   * This will enable static types for ui-graphics.
   */
  const uiGraphicNames = getSlugs({ assets: uiGraphicsRes });
  const uiGraphicsPath = getGeneratedImageDataPath({
    fileName: "ui-graphics.json",
  });
  writeJsonForTypes({
    names: uiGraphicNames,
    path: getGeneratedImageDataPath({ fileName: "ui-graphics.json" }),
  });
  console.log(`✅ UI graphic names written to ${uiGraphicsPath}`);

  const spriter = getSpriterInstance({ mode: "symbol" });

  for (const spriteIcon of [...uiIconsRes, ...uiGraphicsRes]) {
    await fetchSvgAndAddToSprite({
      url: spriteIcon.image.asset.url,
      name: spriteIcon.slug.current,
      spriter,
    });
  }
  const spritePath = getPublicSpritePath({ fileName: "sprite.svg" });

  compileAndWriteSpriteToFile({ path: spritePath, spriter });

  console.log(`✅ SVG Sprite sheet written to ${spritePath}`);
}

main();
