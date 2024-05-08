import { resolveOakHref } from "@/common-lib/urls";

export const useBackHref = ({
  baseSlug,
  yearSlug,
  isLegacy = false,
  tierSlug,
  examboardSlug,
}: {
  baseSlug: string;
  yearSlug: string;
  isLegacy: boolean;
  tierSlug?: string | null;
  examboardSlug?: string | null;
}) => {
  const hasTier = tierSlug && tierSlug !== null;
  const hasExamboard = examboardSlug && examboardSlug !== null;
  const optionSlug = `options${isLegacy ? "-l" : ""}`;

  switch (true) {
    case hasTier && hasExamboard:
      return [
        `${resolveOakHref({
          page: "pupil-programme-index",
          programmeSlug: baseSlug,
          optionSlug,
        })}?examboard=${examboardSlug}`,
        "Select tiers",
      ];
    case hasTier && !hasExamboard:
      return [
        resolveOakHref({
          page: "pupil-programme-index",
          programmeSlug: baseSlug,
          optionSlug,
        }),
        "Select tiers",
      ];
    case hasExamboard && !hasTier:
      return [
        resolveOakHref({
          page: "pupil-programme-index",
          programmeSlug: baseSlug,
          optionSlug,
        }),
        "Select examboards",
      ];
    default:
      return [
        resolveOakHref({ page: "pupil-subject-index", yearSlug }),
        "Select subjects",
      ];
  }
};
