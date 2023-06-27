const { writeFile } = require("fs/promises");

const { getSanityClient } = require("./get_sanity_client");

async function writeAsset({ fileName, assetData }) {
  /**
   * These do not form a sprite sheet, instead their Sanity asset data is
   * stored in json ready to be consumed by @sanity/image-url
   */
  const assetsBySlug = [...assetData]
    .sort((a, b) => (a.slug.current > b.slug.current ? 1 : -1))
    .reduce((acc, cur) => {
      // Extracting _id, url for consistent order
      const { _id, url } = cur.image.asset;
      acc[cur.slug.current] = { _id, url };
      return acc;
    }, {});

  const subjectIconsPath = `src/image-data/generated/${fileName}.json`;

  await writeFile(subjectIconsPath, JSON.stringify(assetsBySlug));

  console.log(`✅ ${fileName} data written to ${subjectIconsPath}`);
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

  await writeAsset({
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

  await writeAsset({
    fileName: "illustrations",
    assetData: illustrationsRes,
  });

  const brandAssetRes = await client.fetch(`*[_type == "brandAsset"] {
    logoWithText {
      image {
        asset->{
          _id,
          url
        }
      }
    },
  }`);

  await writeAsset({
    fileName: "brand-assets",
    assetData: [
      {
        ...brandAssetRes[0].logoWithText,
        slug: { current: "logo-with-text" },
      },
    ],
  });
}

main();
