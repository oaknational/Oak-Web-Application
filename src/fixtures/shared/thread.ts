import { Thread } from "@oaknational/oak-curriculum-schema";

import { getIdFromSlug, getTitleFromSlug } from "./helper";

type AlteredThread = Thread & {
  thread_order: number;
};

const ID_MAP = new Map();

const BASE_THREAD = {
  thread_id: 1,
  thread_title: "Test",
  thread_slug: "test",
  thread_order: 1,
};

export function createThread(partial?: Partial<AlteredThread>) {
  const existingId = getIdFromSlug(ID_MAP, partial?.thread_slug);
  const title = getTitleFromSlug(partial?.thread_slug);
  return {
    ...BASE_THREAD,
    ...(existingId ? { thread_id: existingId } : {}),
    ...(title ? { thread_title: title } : {}),
    ...partial,
  };
}
