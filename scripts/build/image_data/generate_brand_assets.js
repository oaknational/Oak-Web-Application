const { writeFileSync } = require("node:fs");

const { getSanityClient } = require("./get_sanity_client");

async function main() {
  const client = getSanityClient();

  const brandAssetRes = await client.fetch(`*[_type == "brandAsset"] {
    logoWithText {
      image {
        asset->
      }
    },
    faviconImage {
      image {
        asset->
      }
    }
  }`);

  const [{ logoWithText }] = brandAssetRes;

  const logoPath = "src/image-data/generated/logo-with-text.svg";
  const svg = await (await fetch(logoWithText.image.asset.url)).text();

  writeFileSync(logoPath, svg);
}

main();
