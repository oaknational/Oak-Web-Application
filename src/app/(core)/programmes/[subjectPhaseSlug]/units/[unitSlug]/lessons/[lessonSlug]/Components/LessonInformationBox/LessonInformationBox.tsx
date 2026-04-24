import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakIconName,
  OakP,
} from "@oaknational/oak-components";

import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";
import CopyrightLicence from "@/components/TeacherComponents/CopyrightLicence/CopyrightLicence";

type LessonInformationBoxProps = {
  teacherTip?: string[];
  equipment?: string[];
  contentGuidance?: string[];
  supervision?: string;
  filesNeeded?: {
    href: string;
    files: string[];
    georestricted: boolean;
    loginRequired: boolean;
  };
  licence?: {
    copyrightYear: string;
  };
};

const LessonInformationBox = (props: LessonInformationBoxProps) => {
  const {
    teacherTip,
    equipment,
    contentGuidance,
    supervision,
    filesNeeded,
    licence,
  } = props;
  const isPlural = filesNeeded && filesNeeded.files.length > 1;

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
          items={[supervision]}
        />
      )}
      {filesNeeded && (
        <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
          <OakFlex $alignItems={"center"} $gap={"spacing-8"}>
            <OakIcon iconName={"additional-material"} />
            <OakHeading tag="h3" $font={"heading-7"}>
              {`${isPlural ? "Files" : "File"} needed for this lesson`}
            </OakHeading>
          </OakFlex>
          {filesNeeded.files.map((file) => (
            <OakP $font={"body-2"} key={file}>
              {file}
            </OakP>
          ))}
          <OakP>
            {`Download ${isPlural ? "these files" : "this file"} to use in the
            lesson.`}
          </OakP>
          <LoginRequiredButton
            buttonVariant="tertiary"
            signUpProps={{
              name: `Sign in to download lesson ${isPlural ? "files" : "file"}`,
            }}
            element="a"
            actionProps={{
              name: `Download lesson ${isPlural ? "files" : "file"}`,
              isActionGeorestricted: filesNeeded.georestricted,
              iconName: "arrow-right",
              href: filesNeeded.href,
              isTrailingIcon: true,
            }}
            geoRestricted={filesNeeded.georestricted}
            loginRequired={filesNeeded.loginRequired}
          />
        </OakFlex>
      )}
      {licence && (
        <CopyrightLicence
          openLinksExternally={true}
          copyrightYear={licence.copyrightYear}
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
