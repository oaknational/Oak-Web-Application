import { Redirect } from "next";

import { resolveOakHref } from "@/common-lib/urls";

type Pathway = { keyStageSlug: string; subjectSlug: string };
type EyfsPathway = Pathway & {
  keyStageSlug: "early-years-foundation-stage";
};

/**
 * Redirect to the EYFS page for the given pathway
 */
export const redirectToEyfsPage = (pathway: EyfsPathway): Redirect => {
  return {
    destination: resolveOakHref({
      page: "eyfs-page",
      subjectSlug: pathway.subjectSlug,
    }),
    statusCode: 301,
  };
};

/**
 * Check if the pathway is an EYFS pathway
 */
export function isEyfsPathway<T extends Pathway>(
  pathway: T | undefined,
): pathway is T & EyfsPathway {
  return pathway?.keyStageSlug === "early-years-foundation-stage";
}
