import { OakFlex, OakLI, OakSpan } from "@oaknational/oak-components";

import { formatBytes } from "@/utils/formatBytes";

export type PupilLessonIntroAdditionalFileItemProps = {
  displayName: string;
  bytes: number;
  url: string;
};

export const PupilLessonIntroAdditionalFileItem = ({
  displayName,
  bytes,
  url,
}: PupilLessonIntroAdditionalFileItemProps) => {
  const extension = url.split(".").pop();

  return (
    <OakLI $listStyle="none">
      <OakFlex $flexDirection="column">
        <OakSpan>{displayName}</OakSpan>
        <OakSpan>{`${formatBytes(bytes)} (${extension?.toUpperCase()})`}</OakSpan>
      </OakFlex>
    </OakLI>
  );
};
