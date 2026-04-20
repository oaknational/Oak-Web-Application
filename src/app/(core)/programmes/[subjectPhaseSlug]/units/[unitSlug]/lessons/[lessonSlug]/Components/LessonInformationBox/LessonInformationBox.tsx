import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakP,
} from "@oaknational/oak-components";

type LessonInformationBoxProps = {
  teacherTip?: string[];
  equipment?: string[];
  contentGuidance?: string[];
  supervision?: string[];
  filesNeeded?: string[];
  showLicence?: boolean;
};

const LessonInformationBox = (props: LessonInformationBoxProps) => {
  const { teacherTip, equipment, contentGuidance } = props;

  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"spacing-32"}
      $background={teacherTip ? "bg-decorative2-subdued" : "bg-neutral"}
      $pa={"spacing-24"}
      $borderRadius={"border-radius-l"}
      data-testid="lesson-information-container"
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
      {equipment && (
        <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
          <OakFlex $alignItems={"center"} $gap={"spacing-8"}>
            <OakIcon iconName="equipment-required" />
            <OakHeading tag="h3" $font={"heading-7"}>
              Equipment
            </OakHeading>
          </OakFlex>
          {equipment.map((item) => (
            <OakP $font={"body-2"} key={item}>
              {item}
            </OakP>
          ))}
        </OakFlex>
      )}
      {contentGuidance && (
        <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
          <OakFlex $alignItems={"center"} $gap={"spacing-8"}>
            <OakIcon iconName="warning" />
            <OakHeading tag="h3" $font={"heading-7"}>
              Content guidance
            </OakHeading>
          </OakFlex>
          {contentGuidance.map((item) => (
            <OakP $font={"body-2"} key={item}>
              {item}
            </OakP>
          ))}
        </OakFlex>
      )}
    </OakFlex>
  );
};

export default LessonInformationBox;
