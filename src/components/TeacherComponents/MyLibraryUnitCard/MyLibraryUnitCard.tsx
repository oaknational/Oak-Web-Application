import {
  OakFlex,
  OakHeading,
  OakP,
  OakSpan,
  OakBox,
  OakLI,
  OakLink,
} from "@oaknational/oak-components";
import { ReactNode } from "react";
import styled from "styled-components";

import { SaveUnitButton } from "../SaveUnitButton/SaveUnitButton";

import { resolveOakHref } from "@/common-lib/urls";
import useMediaQuery from "@/hooks/useMediaQuery";
import { MyLibraryUnit } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

const StyledOL = styled.ol`
  list-style-type: none;
  padding: 0;
`;

const StyledOakLI = styled(OakLI)`
  &:last-child {
    padding-bottom: 0;
  }
`;

const getLastSavedText = (date: string) => {
  const dateObj = new Date(date);
  const isToday = dateObj.toDateString() === new Date().toDateString();
  const formattedDate = dateObj.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const formattedTime = dateObj.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return isToday
    ? `Saved at ${formattedTime}`
    : `Saved on ${formattedDate} at ${formattedTime}`;
};

const UnitCardHeader = ({
  saveButton,
  ...props
}: MyLibraryUnitCardProps & {
  saveButton?: ReactNode;
}) => {
  const { unitTitle, year, savedAt, optionalityTitle } = props;

  const lastSavedText = getLastSavedText(savedAt);
  const mainTitle = optionalityTitle ?? unitTitle;
  const superTitle = optionalityTitle ? unitTitle : undefined;

  return (
    <OakFlex
      $flexGrow={1}
      $alignItems={["stretch", "start"]}
      $justifyContent={["start", "space-between"]}
      $flexDirection={["column", "row"]}
      $gap={["spacing-16", "spacing-12"]}
    >
      <OakFlex $flexGrow={1} $flexDirection={"column"} $gap={"spacing-8"}>
        {superTitle && (
          <OakP $font={"heading-light-7"} $color={"text-primary"}>
            {superTitle}
          </OakP>
        )}
        <OakLink
          variant="secondary"
          href={resolveOakHref({
            page: "unit-overview",
            programmeSlug: props.programmeSlug,
            unitSlug: props.unitSlug,
          })}
          onClick={props.trackUnitAccessed}
        >
          <OakHeading
            tag="h3"
            $font={["heading-7", "heading-5"]}
            $color={"text-primary"}
          >
            {mainTitle}
          </OakHeading>
        </OakLink>
        <OakP $color={"text-subdued"} $font={"body-2"}>
          {year}
          <OakSpan $ph={"spacing-8"}>•</OakSpan>
          {lastSavedText}
        </OakP>
      </OakFlex>
      {saveButton ? <OakBox>{saveButton}</OakBox> : null}
    </OakFlex>
  );
};

const UnitCardContent = ({
  lessonCountHeader,
  saveButton,
  ...props
}: {
  lessonCountHeader: string;
  saveButton?: ReactNode;
} & MyLibraryUnitCardProps) => {
  const { unitSlug, programmeSlug, lessons } = props;

  return (
    <OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-24"} $width="100%">
        <OakFlex $justifyContent={"space-between"} $alignItems="center">
          <OakP $font={"heading-light-7"}>{lessonCountHeader}</OakP>
          {saveButton ? <OakBox>{saveButton}</OakBox> : null}
        </OakFlex>
        <OakBox
          $bl={["border-solid-none", "border-solid-s"]}
          $pl={["spacing-0", "spacing-24"]}
          $color="border-decorative1-stronger"
        >
          <StyledOL>
            {lessons
              .toSorted((a, b) => a.order - b.order)
              .map((lesson, i) => {
                const href = resolveOakHref({
                  page: "lesson-overview",
                  programmeSlug,
                  unitSlug,
                  lessonSlug: lesson.slug,
                });

                return (
                  <StyledOakLI
                    key={lesson.slug}
                    $pb={"spacing-20"}
                    $font={"heading-light-7"}
                    onClick={() => props.trackLessonAccessed(lesson.slug)}
                  >
                    <OakFlex>
                      <OakP
                        $textAlign={"right"}
                        $mr={"spacing-4"}
                        $color={
                          lesson.state === "published"
                            ? "text-primary"
                            : "text-disabled"
                        }
                      >
                        {i + 1}.{" "}
                      </OakP>
                      {lesson.state === "published" ? (
                        <OakLink href={href} variant="secondary">
                          {lesson.title}
                        </OakLink>
                      ) : (
                        <OakP $color={"text-disabled"}>{lesson.title}</OakP>
                      )}
                    </OakFlex>
                  </StyledOakLI>
                );
              })}
          </StyledOL>
        </OakBox>
      </OakFlex>
    </OakFlex>
  );
};

export type MyLibraryUnitCardProps = Omit<
  MyLibraryUnit,
  "yearOrder" | "unitOrder" | "yearSlug" | "pathway" | "examboard"
> & {
  programmeSlug: string;
  keyStageSlug: string;
  keyStageTitle: KeyStageTitleValueType | undefined;
  subjectTitle: string;
  subjectSlug: string;
  trackUnitAccessed: () => void;
  trackLessonAccessed: (lessonSlug: string) => void;
};

export default function MyLibraryUnitCard(props: MyLibraryUnitCardProps) {
  const {
    lessons,
    unitTitle,
    programmeSlug,
    unitSlug,
    keyStageTitle,
    keyStageSlug,
    subjectTitle,
    subjectSlug,
  } = props;

  const isMobile = useMediaQuery("mobile");

  const unpublishedLessonCount = lessons.filter(
    (lesson) => lesson.state !== "published",
  ).length;

  const lessonCountHeader = unpublishedLessonCount
    ? `${lessons.length - unpublishedLessonCount}/${lessons.length} lessons`
    : `${lessons.length} lessons`;

  const saveButton = (
    <SaveUnitButton
      buttonVariant="default"
      programmeSlug={programmeSlug}
      unitSlug={unitSlug}
      unitTitle={unitTitle}
      trackingProps={{
        savedFrom: "my-library-save-button",
        keyStageTitle,
        keyStageSlug,
        subjectTitle,
        subjectSlug,
      }}
    />
  );

  return (
    <OakFlex
      $color={"text-primary"}
      $flexDirection={"column"}
      $background={"bg-primary"}
      $borderRadius={"border-radius-m2"}
      $pa={["spacing-16", "spacing-32"]}
      $maxWidth={"spacing-960"}
      $gap={"spacing-20"}
      $width="100%"
    >
      <OakFlex $gap={["spacing-16", "spacing-24"]}>
        <UnitCardHeader {...props} saveButton={isMobile ? null : saveButton} />
      </OakFlex>
      <UnitCardContent
        lessonCountHeader={lessonCountHeader}
        saveButton={isMobile ? saveButton : null}
        {...props}
      />
    </OakFlex>
  );
}
