const { getSanityClient } = require("./get_sanity_client");
const {
  fetchSvgAndAddToSprite,
  compileAndWriteSpriteToFile,
  writeJsonForTypes,
  getPublicSpritePath,
  getSpriterInstance,
} = require("./helpers");

async function main() {
  const client = getSanityClient();

  const uiIconsRes =
    await client.fetch(`*[_type == "uiIcon" && _id in *[_type == "uiIcon" && defined(image.asset) && defined(title) && defined(slug) && image.asset->.url != null]._id] {
    title,
    slug,
    image {
      asset-> {
        url
      }
    }
  }`);

  const uiGraphicsRes =
    await client.fetch(`*[_type == "uiGraphic" && _id in *[_type == "uiGraphic" && defined(image.asset) && defined(title) && defined(slug) && image.asset->.url != null]._id] {
    title,
    slug,
    image {
      asset-> {
        url
      }
    }
  }`);

  function getSlugs({ assets }) {
    return (
      assets
        // filter to only have assets with an image url and a slug
        .filter((asset) => asset.image?.asset?.url && asset.slug?.current)
        .map((asset) => asset.slug.current)
    );
  }

  /**
   * uiIconsBySlug -> image-data/ui-icons.json
   * This will enable static types for ui-icons.
   */
  const uiIconNames = getSlugs({ assets: uiIconsRes });
  const uiIconsPath = await writeJsonForTypes({
    names: uiIconNames,
    fileName: "ui-icons.json",
  });
  console.log(`✅ UI icon names written to ${uiIconsPath}`);

  /**
   * uiGraphicsBySlug -> image-data/ui-graphics.json
   * This will enable static types for ui-graphics.
   */
  const uiGraphicNames = getSlugs({ assets: uiGraphicsRes });
  const uiGraphicsPath = await writeJsonForTypes({
    names: uiGraphicNames,
    fileName: "ui-graphics.json",
  });
  console.log(`✅ UI graphic names written to ${uiGraphicsPath}`);

  const spriter = getSpriterInstance({ mode: "symbol" });

  for (const spriteIcon of [...uiIconsRes, ...uiGraphicsRes]) {
    if (spriteIcon?.image?.asset?.url && spriteIcon?.slug?.current) {
      await fetchSvgAndAddToSprite({
        url: spriteIcon.image.asset.url,
        name: spriteIcon.slug.current,
        spriter,
      });
    }
  }
  const spritePath = getPublicSpritePath({ fileName: "sprite.svg" });

  compileAndWriteSpriteToFile({ path: spritePath, spriter });

  console.log(`✅ SVG Sprite sheet written to ${spritePath}`);
}

main();
