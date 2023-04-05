const path = require("path");
const { writeFile, unlink, mkdir } = require("fs/promises");

const favicons = require("favicons").default;

const { getSanityClient } = require("./get_sanity_client");

async function main() {
  const client = getSanityClient();
  const brandAssetRes = await client.fetch(`*[_type == "brandAsset"] {
    faviconImage {
      image {
        asset->
      }
    }
  }`);
  const [{ faviconImage }] = brandAssetRes;
  console.log(faviconImage);

  const svg = (await (await fetch(faviconImage.image.asset.url)).text())
    .replace(`fill="#000"`, `fill="currentColor"`)
    .replace(`fill="black"`, `fill="currentColor"`);

  const svgPath = `public/images/favicons/favicon.svg`;
  await writeFile(path.resolve(svgPath), svg);

  const dest = "./public/images/favicons"; // Output directory path.
  const htmlBasename = "index.html"; // HTML file basename.

  // @see https://github.com/itgalaxy/favicons#usage
  const configuration = {
    path: "/images/favicons",
    appName: "Oak National Academy",
    appShortName: "Oak",
    appDescription:
      "Our Collection Of Adaptable Lesson Planning Resources Are Made For Teachers - Browse By subject, Key Stage From Reception To Year 11 And Download For Free",
    background: "#BEF2BD",
    theme_color: "#a0b6f2",
    categories: ["education"],
    lang: "en-GB",
  };

  const response = await favicons(svgPath, configuration);

  // Below is the processing.
  await mkdir(dest, { recursive: true });
  await Promise.all(
    response.images.map(
      async (image) =>
        await writeFile(path.join(dest, image.name), image.contents)
    )
  );
  await Promise.all(
    response.files.map(
      async (file) => await writeFile(path.join(dest, file.name), file.contents)
    )
  );
  await writeFile(path.join(dest, htmlBasename), response.html.join("\n"));

  await unlink(svgPath);

  console.log(response.images); // Array of { name: string, contents: <buffer> }
  console.log(response.files); // Array of { name: string, contents: <string> }
  console.log(response.html); // Array of strings (html elements)
}

main();
