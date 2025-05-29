import {
  OakFlex,
  OakHeading,
  OakSmallTertiaryInvertedButton,
  OakP,
  OakSpan,
  OakBox,
  OakLI,
  OakSecondaryLink,
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

const SaveButton = ({
  unitTitle,
  onSave,
  isSaved,
}: Pick<MyLibraryUnitCardProps, "unitTitle" | "onSave" | "isSaved">) => {
  return (
    <OakSmallTertiaryInvertedButton
      iconName={isSaved ? "bookmark-filled" : "bookmark-outlined"}
      isTrailingIcon
      onClick={onSave}
      aria-label={`${isSaved ? "Unsave" : "Save"} this unit: ${unitTitle} `}
    >
      {isSaved ? "Saved" : "Save"}
    </OakSmallTertiaryInvertedButton>
  );
};

const UnitCardHeader = ({ ...props }: MyLibraryUnitCardProps) => {
  const { unitTitle, year, savedAt, onSave, isSaved, optionalityTitle } = props;

  const lastSavedText = getLastSavedText(savedAt);
  const mainTitle = optionalityTitle ?? unitTitle;
  const superTitle = optionalityTitle ? unitTitle : undefined;
  return (
    <OakFlex $flexGrow={1} $alignItems={"start"} $gap={"space-between-xs"}>
      <OakFlex
        $flexGrow={1}
        $flexDirection={"column"}
        $gap={"space-between-ssx"}
      >
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
          <OakSpan $ph={"inner-padding-xs"}>•</OakSpan>
          {lastSavedText}
        </OakP>
      </OakFlex>
      <OakBox $display={["none", "block"]}>
        <SaveButton unitTitle={unitTitle} onSave={onSave} isSaved={isSaved} />
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
  const { unitTitle, unitSlug, programmeSlug, lessons, onSave, isSaved } =
    props;

  return (
    <OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
        <OakFlex $justifyContent={"space-between"} $alignItems="center">
          <OakP $font={"heading-light-7"}>{lessonCountHeader}</OakP>
          <OakBox $display={["block", "none"]}>
            <SaveButton
              unitTitle={unitTitle}
              onSave={onSave}
              isSaved={isSaved}
            />
          </OakBox>
        </OakFlex>
        <OakBox
          $bl={["border-solid-none", "border-solid-s"]}
          $pl={["inner-padding-none", "inner-padding-xl"]}
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
                    $pb={"inner-padding-l"}
                    $font={"heading-light-7"}
                  >
                    <OakFlex>
                      <OakP
                        $textAlign={"right"}
                        $mr={"space-between-sssx"}
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
  "yearOrder" | "unitOrder"
> & {
  programmeSlug: string;
  onSave?: () => void;
  isSaved?: boolean;
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
      $pa={["inner-padding-m", "inner-padding-xl2"]}
      $maxWidth={"all-spacing-23"}
      $gap={"all-spacing-5"}
      $width="100%"
    >
      <OakFlex $gap={["space-between-s", "space-between-m"]}>
        <UnitCardHeader {...props} />
      </OakFlex>
      <UnitCardContent lessonCountHeader={lessonCountHeader} {...props} />
    </OakFlex>
  );
}
