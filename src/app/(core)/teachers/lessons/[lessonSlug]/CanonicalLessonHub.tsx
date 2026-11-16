"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakMaxWidth,
} from "@oaknational/oak-components";

import {
  Header,
  SubjectIcon,
} from "@/components/TeacherComponents/Header/Header";

export const CanonicalLessonHub = ({
  subjectSlug,
  lessonName,
}: {
  subjectSlug: string;
  lessonName: string;
}) => {
  return (
    <OakFlex $flexDirection="column" $gap={"spacing-64"}>
      <Header
        layoutVariant="compact"
        subjectIcon={`subject-${subjectSlug}` as SubjectIcon}
        heading={lessonName}
        backgroundColorLevel={1}
      />
      <OakMaxWidth>
        <OakBox
          $pa="spacing-20"
          $btr="border-radius-l"
          $background={"bg-neutral"}
          $mr="spacing-16"
          $maxWidth="fit-content"
        >
          <OakHeading
            tag="h3"
            $font="heading-5"
            $overflow="hidden"
            $textOverflow="ellipsis"
            $whiteSpace="nowrap"
            data-testid="year-heading"
          >
            Lesson appears in
          </OakHeading>
        </OakBox>
        <OakBox
          $background={"bg-neutral"}
          $pa={"spacing-20"}
          $position={"relative"}
          $mb={"spacing-48"}
          $bbr="border-radius-l"
          $btrr="border-radius-l"
         />
      </OakMaxWidth>
    </OakFlex>
  );
};
