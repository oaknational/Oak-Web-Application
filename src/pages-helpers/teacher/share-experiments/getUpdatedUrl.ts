import {
  createAndStoreShareId,
  getShareIdKey,
  shareMethods,
} from "@/utils/createShareId";

export const getUpdatedUrl = ({
  url,
  urlShareId,
  cookieShareId,
  lessonSlug,
}: {
  url: string;
  urlShareId: string | null;
  cookieShareId: string | undefined;
  lessonSlug: string;
}) => {
  const shareIdKey = getShareIdKey(lessonSlug);

  const strippedUrl = url.split("?")[0];

  console.log("URL Share ID:", urlShareId);
  console.log("Cookie Share ID:", cookieShareId);

  if (urlShareId && cookieShareId === urlShareId) {
    console.log("Share ID already stored in cookie");
    // we already generated a share-id from this page
    return { url, shareIdKey, shareId: urlShareId };
  }

  // generate share-id and store it as a cookie
  const { id, key } = createAndStoreShareId(lessonSlug);

  const updatedUrl = `${strippedUrl}?${key}=${id}&sm=${shareMethods.url}`;
  return { url: updatedUrl, shareIdKey: key, shareId: id };
};
