import { OakFlex, OakLI, OakSpan } from "@oaknational/oak-components";

import { convertBytesToMegabytes } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";

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
    <OakLI>
      <OakFlex $flexDirection="column">
        <OakSpan>{displayName}</OakSpan>
        <OakSpan>{`${convertBytesToMegabytes(bytes)} (${extension?.toUpperCase()})`}</OakSpan>
      </OakFlex>
    </OakLI>
  );
};
