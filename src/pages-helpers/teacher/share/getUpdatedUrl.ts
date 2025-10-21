import {
  createAndStoreShareId,
  getShareIdKey,
  shareMethods,
  shareSources,
} from "@/pages-helpers/teacher/share/createShareId";

/**
 *
 * updates the url with either the stored share-id or a newly generated one
 *
 */

export const getUpdatedUrl = ({
  url,
  storageShareId,
  unhashedKey,
  source,
  shareMethod = "url",
}: {
  url: string;
  storageShareId: string | undefined;
  unhashedKey: string;
  source: keyof typeof shareSources;
  shareMethod?: keyof typeof shareMethods;
}) => {
  const shareIdKey = getShareIdKey(unhashedKey);
  const strippedUrl = url.split("?")[0];

  if (storageShareId) {
    const updatedUrl = `${strippedUrl}?${shareIdKey}=${storageShareId}&sm=${shareMethods[shareMethod]}&src=${shareSources[source]}`;
    return { url: updatedUrl, shareIdKey, shareId: storageShareId };
  }

  // generate share-id and store
  const { id, key } = createAndStoreShareId(unhashedKey);

  const updatedUrl = `${strippedUrl}?${key}=${id}&sm=${shareMethods[shareMethod]}&src=${shareSources[source]}`;
  return { url: updatedUrl, shareIdKey: key, shareId: id };
};
