import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

type LessonInformationBoxProps = {
  teacherTip?: string[];
  equipment?: string[];
  contentGuidance?: string[];
  supervision?: string[];
  filesNeeded?: string[];
  showLicence?: boolean;
};

const LessonInformationBox = (props: LessonInformationBoxProps) => {
  const { teacherTip } = props;
  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"spacing-32"}
      $background={teacherTip ? "bg-decorative2-subdued" : "bg-neutral"}
      $pa={"spacing-24"}
      $borderRadius={"border-radius-l"}
    >
      {teacherTip && (
        <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
          <OakHeading tag="h3" $font={"heading-7"}>
            Teacher tip
          </OakHeading>
          {teacherTip.map((tip) => (
            <OakP $font={"body-2"} key={tip}>
              {tip}
            </OakP>
          ))}
        </OakFlex>
      )}
    </OakFlex>
  );
};

export default LessonInformationBox;
