import { OakPupilContentGuidance } from "@oaknational/oak-components";

export const getDedupedContentGuidanceLabels = (
  contentGuidance: OakPupilContentGuidance[] | null | undefined,
) => {
  return Array.from(
    new Set(
      contentGuidance?.map((guidance) => guidance.contentguidanceLabel || ""),
    ),
  );
};
