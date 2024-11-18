import {
  createAndStoreShareId,
  getShareIdKey,
  shareMethods,
} from "@/pages-helpers/teacher/share-experiments/createShareId";

/**
 *
 * updates the url with either the stored cookie share-id or a newly generated one
 *
 */

export const getUpdatedUrl = ({
  url,
  cookieShareId,
  lessonSlug,
}: {
  url: string;
  cookieShareId: string | undefined;
  lessonSlug: string;
}) => {
  const shareIdKey = getShareIdKey(lessonSlug);
  const strippedUrl = url.split("?")[0];

  if (cookieShareId) {
    console.log("Share ID already stored in cookie");
    const updatedUrl = `${strippedUrl}?${shareIdKey}=${cookieShareId}&sm=${shareMethods.url}`;
    return { url: updatedUrl, shareIdKey, shareId: cookieShareId };
  }

  // generate share-id and store it as a cookie
  const { id, key } = createAndStoreShareId(lessonSlug);

  const updatedUrl = `${strippedUrl}?${key}=${id}&sm=${shareMethods.url}`;
  return { url: updatedUrl, shareIdKey: key, shareId: id };
};
