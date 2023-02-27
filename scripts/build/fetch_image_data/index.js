/**
 * This app uses images which are intellectual property of Oak and are not to
 * be open sourced.
 *
 * These images include UI icons, illustrations, and other graphics.
 *
 * The images are hosted in Sanity, and this script is used to fetch the image
 * data, which is git ignored so that that it does not persist in the codebase.
 *
 * UI icon and UI graphic images are downloaded and compiled into a spritesheet
 * stored at `public/images/sprite.svg`. Unique slugs for these images are
 * stored in JSON at `src/image-data/ui-icons.json` and
 * `src/image-data/ui-graphics.json`. These JSON files are used for static type
 * inference.
 *
 * Subject icons (whose filesize tends to be larger, and which are used in the
 * app less frequently) are not added to the spritesheet. Instead their Sanity
 * asset data is stored (at `src/image-data/subject-icons.json`) ready to be
 * consumed by @sanity/image-url
 *
 * The Sanity queries use GROQ, find documentation here:
 * https://www.sanity.io/docs/how-queries-work
 */

require("dotenv").config();
const { writeFileSync, readFileSync } = require("node:fs");
const path = require("path");

const sanityClient = require("@sanity/client");
const SVGSpriter = require("svg-sprite");

async function main() {
  const sanityConfig = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_AUTH_SECRET,
  };
  const client = sanityClient(sanityConfig);

  const subjectIconsRes = await client.fetch(`*[_type == "subjectIcon"] {
    slug,
    image {
      asset->{
        _id,
        url
      }
    }
  }`);

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
   * subjectIconsBySlug -> image-data/subject-icons.json
   * These do not form a sprite sheet, instead their Sanity asset data is
   * stored in json ready to be consumed by @sanity/image-url
   */
  const subjectIconsBySlug = subjectIconsRes.reduce((acc, cur) => {
    acc[cur.slug.current] = cur.image.asset;
    return acc;
  }, {});

  writeFileSync(
    "src/image-data/subject-icons.json",
    JSON.stringify(subjectIconsBySlug)
  );

  /**
   * uiIconsBySlug -> image-data/ui-icons.json
   * This will enable static types for ui-icons.
   */
  const uiIconsBySlug = uiIconsRes.reduce((acc, cur) => {
    acc[cur.slug.current] = {};
    return acc;
  }, {});
  writeFileSync("src/image-data/ui-icons.json", JSON.stringify(uiIconsBySlug));

  /**
   * uiGraphicsBySlug -> image-data/ui-graphics.json
   * This will enable static types for ui-graphics.
   */
  const uiGraphicsBySlug = uiGraphicsRes.reduce((acc, cur) => {
    acc[cur.slug.current] = {};
    return acc;
  }, {});
  writeFileSync(
    "src/image-data/ui-graphics.json",
    JSON.stringify(uiGraphicsBySlug)
  );

  const spriterConfig = {
    mode: {
      symbol: { inline: true },
    },
    shape: {
      id: {
        generator: (_svg, file) => {
          return `svg-sprite-${file.stem}`;
        },
      },
    },
    log: "verbose",
  };
  const spriter = new SVGSpriter(spriterConfig);

  for (const spriteIcon of [...uiIconsRes, ...uiGraphicsRes]) {
    /**
     * @todo promise.all
     */
    const slug = spriteIcon.slug.current;
    const url = spriteIcon.image.asset.url;
    const svg = (await (await fetch(url)).text()).replace(
      `fill="#000"`,
      `fill="currentColor"`
    );
    const svgPath = `public/images/sprite/${slug}.svg`;
    writeFileSync(path.resolve(svgPath), svg);

    spriter.add(
      path.resolve(svgPath),
      svgPath,
      readFileSync(path.resolve(svgPath), "utf-8")
    );
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

  writeFileSync("public/images/sprite.svg", sprite);
}

main();
