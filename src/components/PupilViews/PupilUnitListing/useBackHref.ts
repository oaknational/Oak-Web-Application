import { resolveOakHref } from "@/common-lib/urls";

export const useBackHref = ({
  baseSlug,
  yearSlug,
  tierSlug,
  examboardSlug,
}: {
  baseSlug: string;
  yearSlug: string;
  tierSlug?: string | null;
  examboardSlug?: string | null;
}) => {
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
    case hasTier && !hasExamboard:
      return [
        resolveOakHref({
          page: "pupil-programme-index",
          programmeSlug: baseSlug,
          optionSlug,
        }),
        "Change tier",
      ];
    case hasExamboard && !hasTier:
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
