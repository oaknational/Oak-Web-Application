import {
  OakFlex,
  OakHeading,
  OakP,
  OakSpan,
  OakBox,
  OakLI,
  OakSecondaryLink,
  OakSaveButton,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { resolveOakHref } from "@/common-lib/urls";
import { MyLibraryUnit } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";

const StyledOL = styled.ol`
  list-style-type: none;
  padding: 0;
`;

const StyledOakLI = styled(OakLI)`
  &:last-child {
    padding-bottom: 0;
  }
`;

const LessonLink = styled(OakSecondaryLink)`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const UnitLink = styled(OakSecondaryLink)`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
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

const UnitCardHeader = ({ ...props }: MyLibraryUnitCardProps) => {
  const {
    unitTitle,
    year,
    savedAt,
    onSave,
    isSaved,
    optionalityTitle,
    isSaving,
  } = props;

  const lastSavedText = getLastSavedText(savedAt);
  const mainTitle = optionalityTitle ?? unitTitle;
  const superTitle = optionalityTitle ? unitTitle : undefined;
  return (
    <OakFlex $flexGrow={1} $alignItems={"start"} $gap={"spacing-12"}>
      <OakFlex $flexGrow={1} $flexDirection={"column"} $gap={"spacing-8"}>
        {superTitle && (
          <OakP $font={"heading-light-7"} $color={"text-primary"}>
            {superTitle}
          </OakP>
        )}
        <UnitLink
          href={resolveOakHref({
            page: "lesson-index",
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
        </UnitLink>
        <OakP $color={"text-subdued"} $font={"body-2"}>
          {year}
          <OakSpan $ph={"spacing-8"}>•</OakSpan>
          {lastSavedText}
        </OakP>
      </OakFlex>
      <OakBox $display={["none", "block"]}>
        <OakSaveButton
          title={unitTitle}
          onSave={onSave}
          isSaved={isSaved}
          isLoading={isSaving}
        />
      </OakBox>
    </OakFlex>
  );
};

const UnitCardContent = ({
  lessonCountHeader,
  ...props
}: {
  lessonCountHeader: string;
} & MyLibraryUnitCardProps) => {
  const {
    unitTitle,
    unitSlug,
    programmeSlug,
    lessons,
    onSave,
    isSaved,
    isSaving,
  } = props;

  return (
    <OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
        <OakFlex $justifyContent={"space-between"} $alignItems="center">
          <OakP $font={"heading-light-7"}>{lessonCountHeader}</OakP>
          <OakBox $display={["block", "none"]}>
            <OakSaveButton
              title={unitTitle}
              onSave={onSave}
              isSaved={isSaved}
              isLoading={isSaving}
            />
          </OakBox>
        </OakFlex>
        <OakBox
          $bl={["border-solid-none", "border-solid-s"]}
          $pl={["spacing-0", "spacing-24"]}
          $color="border-decorative1-stronger"
        >
          <StyledOL>
            {lessons
              .sort((a, b) => a.order - b.order)
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
                        <LessonLink $font={"heading-light-7"} href={href}>
                          {lesson.title}
                        </LessonLink>
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
  onSave: () => void;
  isSaved: boolean;
  isSaving: boolean;
  trackUnitAccessed: () => void;
  trackLessonAccessed: (lessonSlug: string) => void;
};

export default function MyLibraryUnitCard(props: MyLibraryUnitCardProps) {
  const { lessons } = props;

  const unpublishedLessonCount = lessons.filter(
    (lesson) => lesson.state !== "published",
  ).length;

  const lessonCountHeader = unpublishedLessonCount
    ? `${lessons.length - unpublishedLessonCount}/${lessons.length} lessons`
    : `${lessons.length} lessons`;

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
        <UnitCardHeader {...props} />
      </OakFlex>
      <UnitCardContent lessonCountHeader={lessonCountHeader} {...props} />
    </OakFlex>
  );
}
