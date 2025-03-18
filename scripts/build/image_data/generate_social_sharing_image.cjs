const { getSanityClient } = require("./get_sanity_client.cjs");
const { downloadFile, writeJson } = require("./helpers.cjs");

async function main() {
  try {
    const client = getSanityClient();

    const [socialSharingImageRes] =
      await client.fetch(`*[_type == "brandAsset" && defined(socialSharingImage.asset) && socialSharingImage.asset->.url != null] {
        socialSharingImage {
          asset->
        }
      }`);

    const { socialSharingImage } = socialSharingImageRes;

    if (!socialSharingImage) {
      throw new Error(
        "socialSharingImage not found in Sanity, this is likely a schema issue",
      );
    }

    const { asset } = socialSharingImage;

    if (!asset) {
      throw new Error(
        "socialSharingImage.asset not found in Sanity, this is likely because the image hasn't been uploaded/published yet",
      );
    }

    if (asset.extension !== "png") {
      throw new Error("Expected social sharing image to be PNG");
    }

    const url = asset.url;

    const filePath = "images/sharing/default-social-sharing-2022.png";

    await downloadFile({ url, destination: "public/" + filePath });

    const data = {
      filePath,
      height: asset.metadata.dimensions.height,
      width: asset.metadata.dimensions.width,
    };

    await writeJson({
      fileName: "social-sharing-image.json",
      data,
    });

    console.log(`✅ Social sharing image written to ${filePath}`);
  } catch (error) {
    console.error(error);
    console.error("An exception occurred, see above for details.");
    process.exit(1);
  }
}

main();
