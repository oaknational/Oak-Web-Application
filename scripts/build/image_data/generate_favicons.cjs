const path = require("path");
const { writeFile, unlink, mkdir } = require("fs/promises");

const favicons = require("favicons").default;

const { getSanityClient } = require("./get_sanity_client.cjs");
const { writeJson } = require("./helpers.cjs");

async function main() {
  try {
    const client = getSanityClient();
    const brandAssetRes =
      await client.fetch(`*[_type == "brandAsset" && defined(faviconImage.image.asset) && faviconImage.image.asset->.url != null] {
        faviconImage {
          image {
            asset-> {
              url
            }
          }
        }
      }`);
    const [{ faviconImage }] = brandAssetRes;

    // pupilsLimeGreen
    const THEME_LIME_GREEN = "BEF2BD";

    const svg = await (await fetch(faviconImage.image.asset.url)).text();

    const svgPath = `public/images/favicons/favicon.svg`;
    await writeFile(path.resolve(svgPath), svg);

    const dest = "./public/images/favicons"; // Output directory path.

    // @see https://github.com/itgalaxy/favicons#usage
    const configuration = {
      path: "/images/favicons",
      appName: "Oak National Academy",
      appShortName: "Oak",
      appDescription:
        "Our Collection Of Adaptable Lesson Planning Resources Are Made For Teachers - Browse By subject, Key Stage From Reception To Year 11 And Download For Free",
      background: `#${THEME_LIME_GREEN}`,
      theme_color: `#${THEME_LIME_GREEN}`,
      categories: ["education"],
      lang: "en-GB",
      loadManifestWithCredentials: true,
      manifestMaskable: true,
      display: "minimal-ui",
    };

    const response = await favicons(svgPath, configuration);

    // Below is the processing.
    await mkdir(dest, { recursive: true });
    await Promise.all(
      response.images.map(
        async (image) =>
          await writeFile(path.join(dest, image.name), image.contents),
      ),
    );
    await Promise.all(
      response.files.map(
        async (file) =>
          await writeFile(path.join(dest, file.name), file.contents),
      ),
    );
    const innerHTML = response.html.join("");

    await writeJson({ fileName: "favicons.json", data: { innerHTML } });

    await unlink(svgPath);
  } catch (error) {
    console.error(error);
    console.error("An exception occurred, see above for details.");
    process.exit(1);
  }
}

main();
