import { isString } from "lodash";
import {
  OakBox,
  OakBulletList,
  OakFlex,
  OakHeading,
  OakSubjectIcon,
  isValidIconName,
} from "@oaknational/oak-components";

export type PupilLessonOverviewHeaderProps = {
  lessonTitle: string;
  yearDescription?: string | null;
  subject?: string | null;
  subjectSlug: string;
  phase: "primary" | "secondary";
};

export const PupilLessonOverviewHeader = ({
  lessonTitle,
  yearDescription,
  subject,
  subjectSlug,
  phase,
}: PupilLessonOverviewHeaderProps) => {
  const subjectIconName: `subject-${string}` = `subject-${subjectSlug}`;

  return (
    <OakFlex
      $flexDirection={["row", "row", "column"]}
      $alignItems={["center", "center", "flex-start"]}
      $gap={["spacing-16", "spacing-24", "spacing-0"]}
      $borderColor="bg-decorative1-main"
      $pb={["spacing-20", "spacing-0"]}
      $ph={["spacing-16", "spacing-0"]}
      $bb={["border-solid-l", "border-solid-none", "border-solid-none"]}
    >
      {isValidIconName(subjectIconName) && (
        <OakBox $mb={["spacing-0", "spacing-0", "spacing-24"]}>
          <OakSubjectIcon
            iconName={subjectIconName}
            alt=""
            fill={
              phase === "primary"
                ? "bg-decorative4-main"
                : "bg-decorative3-main"
            }
          />
        </OakBox>
      )}

      <OakBox>
        <OakBox $mb="spacing-16" $display={["none", "block"]}>
          <OakBulletList
            listItems={[yearDescription, subject].filter(isString)}
            $color="text-subdued"
          />
        </OakBox>

        <OakHeading tag="h1" $font={["heading-7", "heading-5", "heading-3"]}>
          {lessonTitle}
        </OakHeading>
      </OakBox>
    </OakFlex>
  );
};
