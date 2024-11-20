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
  unhashedKey,
}: {
  url: string;
  cookieShareId: string | undefined;
  unhashedKey: string;
}) => {
  const shareIdKey = getShareIdKey(unhashedKey);
  const strippedUrl = url.split("?")[0];

  if (cookieShareId) {
    const updatedUrl = `${strippedUrl}?${shareIdKey}=${cookieShareId}&sm=${shareMethods.url}`;
    return { url: updatedUrl, shareIdKey, shareId: cookieShareId };
  }

  // generate share-id and store it as a cookie
  const { id, key } = createAndStoreShareId(unhashedKey);

  const updatedUrl = `${strippedUrl}?${key}=${id}&sm=${shareMethods.url}`;
  return { url: updatedUrl, shareIdKey: key, shareId: id };
};
