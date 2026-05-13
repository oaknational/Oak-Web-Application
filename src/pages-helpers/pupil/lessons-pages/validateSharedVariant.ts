import type { GetStaticPropsContext } from "next";

import { getLessonShareVariant } from "@/pages-helpers/pupil";

export const hasValidSharedVariant = (
  context: Pick<GetStaticPropsContext, "params">,
) => {
  const variant = context.params?.variant;

  return typeof variant === "string" && Boolean(getLessonShareVariant(variant));
};
