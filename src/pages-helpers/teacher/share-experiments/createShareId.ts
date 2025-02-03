import { nanoid } from "nanoid";
// !!WARNING!!: This is a non-secure hashing library. It is not suitable for security purposes.
import sha256 from "tiny-hashes/sha256";

import {
  LS_KEY_TEACHER_SHARE_KIDS_INITIATED_SCHEMA,
  LS_KEY_TEACHER_SHARE_IDS_CONVERTED_SCHEMA,
  LS_KEY_TEACHER_SHARE_KEYS_ACTIVATED_SCHEMA,
} from "@/config/localStorageSchemas";
import {
  getNullableLocalstorageWithSchema,
  setLocalstorageWithSchema,
} from "@/utils/localstorage";

export const getShareIdKey = (unhashedKey: string): string => {
  const hash = sha256(unhashedKey).slice(0, 6);
  return `sid-${hash}`;
};

export const getShareId = (unhashedKey: string): string | undefined =>
  getNullableLocalstorageWithSchema(
    getShareIdKey(unhashedKey),
    LS_KEY_TEACHER_SHARE_KIDS_INITIATED_SCHEMA,
  );

export const createAndStoreShareId = (
  unhashedKey: string,
): { key: string; id: string } => {
  const id = nanoid(10);
  const key = getShareIdKey(unhashedKey);
  setLocalstorageWithSchema(
    key,
    LS_KEY_TEACHER_SHARE_KIDS_INITIATED_SCHEMA,
    id,
  );
  return { key, id };
};

export const storeConversionShareId = (id: string) => {
  const key = `cv-${id}`;
  setLocalstorageWithSchema(
    key,
    LS_KEY_TEACHER_SHARE_IDS_CONVERTED_SCHEMA,
    true,
  );
  return key;
};

export const getConversionShareId = (id: string): boolean | undefined =>
  getNullableLocalstorageWithSchema(
    `cv-${id}`,
    LS_KEY_TEACHER_SHARE_IDS_CONVERTED_SCHEMA,
  );

export const storeActivationKey = (key: string) =>
  setLocalstorageWithSchema(
    `av-${key}`,
    LS_KEY_TEACHER_SHARE_KEYS_ACTIVATED_SCHEMA,
    true,
  );

export const getActivationKey = (key: string): boolean | undefined =>
  getNullableLocalstorageWithSchema(
    `av-${key}`,
    LS_KEY_TEACHER_SHARE_KEYS_ACTIVATED_SCHEMA,
  );

export const shareMethods = {
  url: 0,
  button: 1,
};

export const shareSources = {
  "lesson-browse": 0,
  "lesson-canonical": 1,
  "download-browse": 2,
  "download-canonical": 2,
  "lesson-listing": 3,
  "lesson-browse-w-note": 4,
  "lesson-canonical-w-note": 5,
};

export type ShareSource = keyof typeof shareSources;
