const { writeFileSync } = require("node:fs");

const { getSanityClient } = require("./get_sanity_client");

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

  /**
   * subjectIconsBySlug -> image-data/subject-icons.json
   * These do not form a sprite sheet, instead their Sanity asset data is
   * stored in json ready to be consumed by @sanity/image-url
   */
  const subjectIconsBySlug = subjectIconsRes.reduce((acc, cur) => {
    acc[cur.slug.current] = cur.image.asset;
    return acc;
  }, {});

  const subjectIconsPath = "src/image-data/generated/subject-icons.json";

  writeFileSync(subjectIconsPath, JSON.stringify(subjectIconsBySlug));

  console.log(`✅ Subject icons data written to ${subjectIconsPath}`);
}

main();
