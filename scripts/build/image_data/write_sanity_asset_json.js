const { writeFileSync } = require("node:fs");

const { getSanityClient } = require("./get_sanity_client");

function writeAssetJson({ assetTypeName, fileName, assetData }) {
  /**
   * These do not form a sprite sheet, instead their Sanity asset data is
   * stored in json ready to be consumed by @sanity/image-url
   */
  const assetsBySlug = assetData.reduce((acc, cur) => {
    acc[cur.slug.current] = cur.image.asset;
    return acc;
  }, {});

  const subjectIconsPath = `src/image-data/generated/${fileName}.json`;

  writeFileSync(subjectIconsPath, JSON.stringify(assetsBySlug));

  console.log(`✅ ${assetTypeName} data written to ${subjectIconsPath}`);
}

async function main() {
  const client = getSanityClient();

  const subjectIconsRes = await client.fetch(`*[_type == "subjectIcon"] {
    slug,
    image {
      asset->{
        _id,
        url
      }
    }
  }`);

  writeAssetJson({
    assetTypeName: "Subject icons",
    fileName: "subject-icons",
    assetData: subjectIconsRes,
  });

  const illustrationsRes = await client.fetch(`*[_type == "illustration"] {
    slug,
    image {
      asset->{
        _id,
        url
      }
    }
  }`);

  console.log(illustrationsRes);

  writeAssetJson({
    assetTypeName: "Illustrations",
    fileName: "illustrations",
    assetData: illustrationsRes,
  });
}

main();
