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

import useMediaQuery from "@/hooks/useMediaQuery";
import { resolveOakHref } from "@/common-lib/urls";

type MyLibraryUnitCardProps = {
  index: number;
  unitTitle: string;
  unitSlug: string;
  programmeSlug: string;
  yearTitle: string;
  saveTime: string;
  href: string;
  lessons: {
    slug: string;
    order: number;
    title: string;
    _state: string;
    lesson_uid: string;
  }[];
  onSave?: () => void;
  isSaved?: boolean;
};

const UnitCardIndex = ({ index }: Pick<MyLibraryUnitCardProps, "index">) => (
  <OakFlex
    $pa={"inner-padding-l"}
    $background={"bg-decorative1-main"}
    $flexDirection={"column"}
    $justifyContent={"center"}
    $alignItems={"center"}
    $width={["all-spacing-8", "all-spacing-11"]}
    $height={["all-spacing-8", "all-spacing-11"]}
    $borderRadius={"border-radius-m"}
  >
    <OakHeading tag="div" $font={["heading-6", "heading-5"]}>
      {index}
    </OakHeading>
  </OakFlex>
);

const SaveButton = ({
  unitTitle,
  onSave,
  isSaved,
}: Pick<MyLibraryUnitCardProps, "unitTitle" | "onSave" | "isSaved">) => (
  <OakSmallTertiaryInvertedButton
    iconName={isSaved ? "bookmark-filled" : "bookmark-outlined"}
    isTrailingIcon
    onClick={onSave}
    aria-label={`${isSaved ? "Unsave" : "Save"} this unit: ${unitTitle} `}
  >
    {isSaved ? "Saved" : "Save"}
  </OakSmallTertiaryInvertedButton>
);

const UnitCardHeader = ({
  isMobile,
  ...props
}: { isMobile: boolean } & MyLibraryUnitCardProps) => {
  const { unitTitle, yearTitle, saveTime, onSave, isSaved } = props;

  return (
    <OakFlex $flexGrow={1} $alignItems={"start"} $gap={"space-between-xs"}>
      <OakFlex
        $flexGrow={1}
        $flexDirection={"column"}
        $gap={"space-between-ssx"}
      >
        <OakHeading tag="h3" $font={["heading-7", "heading-5"]}>
          {unitTitle}
        </OakHeading>
        <OakP $font={"body-2"}>
          {yearTitle}
          <OakSpan $ph={"inner-padding-xs"}>•</OakSpan>
          Saved at{" "}
          {new Date(saveTime).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "numeric",
            minute: "2-digit",
          })}
        </OakP>
      </OakFlex>
      {!isMobile && (
        <SaveButton unitTitle={unitTitle} onSave={onSave} isSaved={isSaved} />
      )}
    </OakFlex>
  );
};

const StyledOL = styled.ol`
  list-style-type: none;
`;

const StyledOakLI = styled(OakLI)`
  &:last-child {
    padding-bottom: 0;
  }
`;

const LessonLink = styled(OakSecondaryLink)`
  text-decoration: none;
  color: black !important;

  &:hover {
    text-decoration: underline;
  }
`;

const UnitCardContent = ({
  lessonCountHeader,
  isMobile,
  ...props
}: {
  lessonCountHeader: string;
  isMobile: boolean;
} & MyLibraryUnitCardProps) => {
  const { unitTitle, unitSlug, programmeSlug, lessons, onSave, isSaved } =
    props;

  return (
    <OakFlex>
      {!isMobile && (
        <OakBox $width={"all-spacing-11"} $mr={"space-between-m"} />
      )}
      <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
        <OakFlex $justifyContent={"space-between"}>
          <OakP $font={"heading-light-7"}>{lessonCountHeader}</OakP>
          {isMobile && (
            <SaveButton
              unitTitle={unitTitle}
              onSave={onSave}
              isSaved={isSaved}
            />
          )}
        </OakFlex>
        <OakBox
          $borderColor={"border-decorative1-stronger"}
          $bl={isMobile ? "border-solid-none" : "border-solid-s"}
          $pl={["inner-padding-none", "inner-padding-xl"]}
        >
          <StyledOL role="list">
            {lessons.map((lesson, i) => {
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
                      style={{ minWidth: "1.5rem" }}
                      $color={
                        lesson._state === "published"
                          ? "text-primary"
                          : "text-disabled"
                      }
                    >
                      {i + 1}.{" "}
                    </OakP>
                    {lesson._state === "published" ? (
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

export default function MyLibraryUnitCard(props: MyLibraryUnitCardProps) {
  const { index, lessons } = props;

  const unpublishedLessonCount = lessons.filter(
    (lesson) => lesson._state !== "published",
  ).length;

  const lessonCountHeader = unpublishedLessonCount
    ? `${lessons.length - unpublishedLessonCount}/${lessons.length} lessons`
    : `${lessons.length} lessons`;

  const isMobile = useMediaQuery("mobile");

  return (
    <OakFlex
      $flexDirection={"column"}
      $background={"bg-primary"}
      $borderRadius={"border-radius-m2"}
      $pa={["inner-padding-m", "inner-padding-xl2"]}
      $maxWidth={"all-spacing-23"}
      $gap={"all-spacing-5"}
    >
      <OakFlex $gap={["space-between-s", "space-between-m"]}>
        <UnitCardIndex index={index} />
        <UnitCardHeader isMobile={isMobile} {...props} />
      </OakFlex>
      <UnitCardContent
        isMobile={isMobile}
        lessonCountHeader={lessonCountHeader}
        {...props}
      />
    </OakFlex>
  );
}
