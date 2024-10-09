import { resolveOakHref } from "@/common-lib/urls";

export type UseBackHrefProps = {
  baseSlug: string;
  yearSlug: string;
  pathwaySlug?: string | null;
  tierSlug?: string | null;
  examboardSlug?: string | null;
};

export const useBackHref = ({
  baseSlug,
  yearSlug,
  tierSlug,
  examboardSlug,
  pathwaySlug,
}: UseBackHrefProps) => {
  // TODO: this could be abstracted so that any combination of factors could be used

  const hasPathway = pathwaySlug && pathwaySlug !== null;
  const hasTier = tierSlug && tierSlug !== null;
  const hasExamboard = examboardSlug && examboardSlug !== null;

  const optionSlug = `options`;

  switch (true) {
    case hasTier && hasExamboard:
      return [
        `${resolveOakHref({
          page: "pupil-programme-index",
          programmeSlug: baseSlug,
          optionSlug,
        })}/examboard/${examboardSlug}`,
        "Change tier",
      ];
    case hasPathway && hasExamboard:
      return [
        `${resolveOakHref({
          page: "pupil-programme-index",
          programmeSlug: baseSlug,
          optionSlug,
        })}/pathway/${pathwaySlug}`,
        "Change examboard",
      ];
    case (hasTier || hasPathway) && !hasExamboard:
      return [
        resolveOakHref({
          page: "pupil-programme-index",
          programmeSlug: baseSlug,
          optionSlug,
        }),
        hasTier ? "Change tier" : "Change pathway",
      ];
    case hasExamboard && !hasTier && !hasPathway:
      return [
        resolveOakHref({
          page: "pupil-programme-index",
          programmeSlug: baseSlug,
          optionSlug,
        }),
        "Change examboard",
      ];
    default:
      return [
        resolveOakHref({ page: "pupil-subject-index", yearSlug }),
        "Change subject",
      ];
  }
};
