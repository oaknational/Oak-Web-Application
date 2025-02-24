import { createThread as createThreadBase } from "../../shared/thread";

import { Thread } from "@/utils/curriculum/types";

export function createThread(partial?: Partial<Thread>) {
  const defaultReturn = createThreadBase({
    // TODO: Make this nicer
    ...(partial?.title ? { thread_title: partial?.title } : {}),
    ...(partial?.slug ? { thread_slug: partial?.slug } : {}),
    ...(partial?.order ? { thread_order: partial?.order } : {}),
  });

  return {
    title: defaultReturn.thread_title,
    slug: defaultReturn.thread_slug,
    order: defaultReturn.thread_order,
  };
}
