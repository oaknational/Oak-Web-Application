import OakError from "@/errors/OakError";

/**
 * Extracts the cloudinary id (public id and version if present)
 * from a URL and returns it.
 *
 * `CldImage` and `OakCloudinaryImage` can automatically extract the Cloudinary id from a URL
 * if it is under the target distribution origin. However currently the curriculum data has the full
 * URL baked in which points to an origin under `cloudinary.com`. In order to construct a new URL under the
 * new distribution inside `thenational.academy` we need to extract the Cloudinary id from the original URL
 *
 * @TODO this function and its use should be removed once the curriculum data is updated to store the cloudinary id or
 * all URLs are updated to reflect the new distribution URL
 */
export function extractCloudinaryIdFromURL(url: string): string {
  const cloudinaryId = /image\/upload\/(.*)$/.exec(url)?.at(1);

  if (!cloudinaryId) {
    throw new OakError({
      code: "cloudinary/failed-to-extract-id-from-url",
      meta: {
        url,
      },
    });
  }

  return cloudinaryId;
}
