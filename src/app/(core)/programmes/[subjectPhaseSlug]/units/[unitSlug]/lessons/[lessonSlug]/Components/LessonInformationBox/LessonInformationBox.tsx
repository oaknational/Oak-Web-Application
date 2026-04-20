import { OakFlex, OakHeading } from "@oaknational/oak-components";
import { ReactNode } from "react";

type LessonInformationBoxProps = {
  teacherTip?: ReactNode;
  equipment?: ReactNode;
  contentGuidance?: ReactNode;
  supervision?: ReactNode;
  filesNeeded?: ReactNode;
  showLicence?: boolean;
};

const LessonInformationBox = (props: LessonInformationBoxProps) => {
  const { teacherTip } = props;
  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"spacing-32"}
      $background={teacherTip ? "bg-decorative2-subdued" : "bg-neutral"}
    >
      {teacherTip && (
        <OakFlex>
          <OakHeading tag="h3" $font={"heading-7"}>
            Teacher tip
          </OakHeading>
        </OakFlex>
      )}
    </OakFlex>
  );
};

export default LessonInformationBox;
