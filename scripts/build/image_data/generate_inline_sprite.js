const { getSanityClient } = require("./get_sanity_client");
const {
  fetchSvgAndAddToSprite,
  compileAndWriteSpriteToFile,
  writeJsonForTypes,
  getGeneratedImageDataPath,
  getSpriterInstance,
} = require("./helpers");

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
  const jsonPath = writeJsonForTypes({
    names: Object.keys(assetsByName),
    fileName: "inline-sprite.json",
  });
  console.log(`✅ Inline sprite asset names written to ${jsonPath}`);

  const spriter = getSpriterInstance({ mode: "defs" });

  for (const [name, asset] of Object.entries(assetsByName)) {
    if (!asset?.image?.asset?.url) {
      throw new Error(`Expected asset "${name}" to exist in sanity`);
    }
    await fetchSvgAndAddToSprite({ url: asset.image.asset.url, name, spriter });
  }

  const spritePath = getGeneratedImageDataPath({
    fileName: "inline-sprite.svg",
  });

  compileAndWriteSpriteToFile({ path: spritePath, spriter });

  console.log(`✅ SVG inline sprite sheet written to ${spritePath}`);
}

main();
