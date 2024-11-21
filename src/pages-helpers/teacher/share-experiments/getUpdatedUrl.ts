import {
  createAndStoreShareId,
  getShareIdKey,
  shareMethods,
  shareSources,
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
  source,
}: {
  url: string;
  cookieShareId: string | undefined;
  unhashedKey: string;
  source: keyof typeof shareSources;
}) => {
  const shareIdKey = getShareIdKey(unhashedKey);
  const strippedUrl = url.split("?")[0];

  if (cookieShareId) {
    const updatedUrl = `${strippedUrl}?${shareIdKey}=${cookieShareId}&sm=${shareMethods.url}&src=${shareSources[source]}`;
    return { url: updatedUrl, shareIdKey, shareId: cookieShareId };
  }

  // generate share-id and store it as a cookie
  const { id, key } = createAndStoreShareId(unhashedKey);

  const updatedUrl = `${strippedUrl}?${key}=${id}&sm=${shareMethods.url}&src=${shareSources[source]}`;
  return { url: updatedUrl, shareIdKey: key, shareId: id };
};
