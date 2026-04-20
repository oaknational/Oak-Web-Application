import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakIconName,
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
  const { teacherTip, equipment, contentGuidance, supervision } = props;

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
        <LessonInformationItem title="Teacher tip" items={teacherTip} />
      )}
      {equipment && (
        <LessonInformationItem
          iconName={"equipment-required"}
          title="Equipment"
          items={equipment}
        />
      )}
      {contentGuidance && (
        <LessonInformationItem
          iconName={"content-guidance"}
          title="Content guidance"
          items={contentGuidance}
        />
      )}
      {supervision && (
        <LessonInformationItem
          iconName={"supervision-level"}
          title="Supervision"
          items={supervision}
        />
      )}
    </OakFlex>
  );
};

const LessonInformationItem = (props: {
  iconName?: OakIconName;
  title: string;
  items: string[];
}) => {
  const { iconName, title, items } = props;
  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
      <OakFlex $alignItems={"center"} $gap={"spacing-8"}>
        {iconName && <OakIcon iconName={iconName} />}
        <OakHeading tag="h3" $font={"heading-7"}>
          {title}
        </OakHeading>
      </OakFlex>
      {items.map((item) => (
        <OakP $font={"body-2"} key={item}>
          {item}
        </OakP>
      ))}
    </OakFlex>
  );
};

export default LessonInformationBox;
