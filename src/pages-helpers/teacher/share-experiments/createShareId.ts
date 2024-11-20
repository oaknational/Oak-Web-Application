import crypto from "crypto";

import { nanoid } from "nanoid";
import Cookies from "js-cookie";

export const getShareIdKey = (unhashedKey: string): string => {
  const hash = crypto
    .createHash("sha256")
    .update(unhashedKey)
    .digest("hex")
    .slice(0, 6);
  return `sid-${hash}`;
};

export const getShareIdFromCookie = (unhashedKey: string): string | undefined =>
  Cookies.get(getShareIdKey(unhashedKey));

export const createAndStoreShareId = (
  unhashedKey: string,
): { key: string; id: string } => {
  const id = nanoid(10);
  const key = getShareIdKey(unhashedKey);
  Cookies.set(key, id, { expires: 30 }); // cookie lasts 30 days
  return { key, id };
};

export const shareMethods = {
  url: 0,
  button: 1,
};
