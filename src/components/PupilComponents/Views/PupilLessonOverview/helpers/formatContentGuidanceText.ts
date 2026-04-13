import { OakPupilContentGuidance } from "@oaknational/oak-components";

export const formatContentGuidanceText = ({
  contentGuidance,
  supervisionLevel,
}: {
  contentGuidance: OakPupilContentGuidance[];
  supervisionLevel?: string | null;
}) => {
  const guidanceText = contentGuidance
    .map((item) => item.contentguidanceLabel)
    .filter(Boolean)
    .map((label) => {
      const hasFullStop = label?.endsWith(".");
      return hasFullStop ? `${label} ` : `${label}. `;
    })
    .join("");

  if (!supervisionLevel) {
    return guidanceText.trim();
  }

  const hasFullStop = supervisionLevel.endsWith(".");
  return `${guidanceText}${hasFullStop ? supervisionLevel : `${supervisionLevel}.`}`;
};
