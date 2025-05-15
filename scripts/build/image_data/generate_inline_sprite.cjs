const { getSanityClient } = require("./get_sanity_client.cjs");
const {
  fetchSvgAndAddToSprite,
  compileAndWriteSpriteToFile,
  writeJsonForTypes,
  getGeneratedImageDataPath,
  getSpriterInstance,
} = require("./helpers.cjs");

async function main() {
  try {
    const client = getSanityClient();

    const [inlineSpriteAssetRes] =
      await client.fetch(`*[_type == "brandAsset" && defined(logoWithText.image.asset) && logoWithText.image.asset->.url != null] {
        logoWithText {
          image {
            asset->
          }
        },
        logo {
          image {
            asset->
          }
        },
      }`);

    const { logoWithText, logo } = inlineSpriteAssetRes;

    const assetsByName = {
      "logo-with-text": logoWithText,
      logo: logo,
    };

    /**
     * assetsByName -> image-data/inline-sprite.json
     * This will enable static types for InlineSpriteSvg.
     */
    const jsonPath = await writeJsonForTypes({
      names: Object.keys(assetsByName),
      fileName: "inline-sprite.json",
    });
    console.log(`✅ Inline sprite asset names written to ${jsonPath}`);

    const spriter = getSpriterInstance();

    for (const [name, asset] of Object.entries(assetsByName)) {
      if (!asset?.image?.asset?.url) {
        throw new Error(`Expected asset "${name}" to exist in sanity`);
      }
      await fetchSvgAndAddToSprite({
        url: asset.image.asset.url,
        name,
        spriter,
      });
    }

    const spritePath = getGeneratedImageDataPath({
      fileName: "inline-sprite.svg",
    });

    compileAndWriteSpriteToFile({ path: spritePath, spriter });

    console.log(`✅ SVG inline sprite sheet written to ${spritePath}`);
  } catch (error) {
    console.error(error);
    console.error("An exception occurred, see above for details.");
    process.exit(1);
  }
}

main();
