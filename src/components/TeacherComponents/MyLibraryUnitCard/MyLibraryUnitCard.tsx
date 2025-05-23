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
import { getBreakpoint, getMediaQuery } from "@/styles/utils/responsive";

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

  &:hover {
    text-decoration: underline;
  }
`;

const UnitLink = styled(OakSecondaryLink)`
  text-decoration: none;
`;

const DesktopTabletOnlyWrapper = styled.div`
  display: block;

  @media ${() => getMediaQuery("mobile")} {
    display: none;
  }
`;

const MobileOnlyWrapper = styled.div`
  display: none;

  @media ${() => getMediaQuery("mobile")} {
    display: block;
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
  const { unitTitle, yearTitle, saveTime, onSave, isSaved } = props;

  const lastSavedText = getLastSavedText(saveTime);

  return (
    <OakFlex $flexGrow={1} $alignItems={"start"} $gap={"space-between-xs"}>
      <OakFlex
        $flexGrow={1}
        $flexDirection={"column"}
        $gap={"space-between-ssx"}
      >
        <UnitLink href={props.href}>
          <OakHeading tag="h3" $font={["heading-7", "heading-5"]}>
            {unitTitle}
          </OakHeading>
        </UnitLink>
        <OakP $color={"text-subdued"} $font={"body-2"}>
          {yearTitle}
          <OakSpan $ph={"inner-padding-xs"}>•</OakSpan>
          {lastSavedText}
        </OakP>
      </OakFlex>
      <DesktopTabletOnlyWrapper>
        <SaveButton unitTitle={unitTitle} onSave={onSave} isSaved={isSaved} />
      </DesktopTabletOnlyWrapper>
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
      <OakBox
        $display={["none", "flex"]}
        $width={"all-spacing-11"}
        $mr={"space-between-m"}
      />

      <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
        <OakFlex $justifyContent={"space-between"}>
          <OakP $font={"heading-light-7"}>{lessonCountHeader}</OakP>
          <MobileOnlyWrapper>
            <SaveButton
              unitTitle={unitTitle}
              onSave={onSave}
              isSaved={isSaved}
            />
          </MobileOnlyWrapper>
        </OakFlex>
        <OakBox
          $borderColor={"border-decorative1-stronger"}
          $bl={["border-solid-none", "border-solid-s"]}
          $pl={["inner-padding-none", "inner-padding-xl"]}
        >
          <StyledOL role="list">
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
                        style={{
                          minWidth:
                            window.innerWidth < getBreakpoint("small")
                              ? "auto"
                              : "1.5rem",
                        }}
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
  }[];
  onSave?: () => void;
  isSaved?: boolean;
};

export default function MyLibraryUnitCard(props: MyLibraryUnitCardProps) {
  const { index, lessons } = props;

  const unpublishedLessonCount = lessons.filter(
    (lesson) => lesson._state !== "published",
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
    >
      <OakFlex $gap={["space-between-s", "space-between-m"]}>
        <UnitCardIndex index={index} />
        <UnitCardHeader {...props} />
      </OakFlex>
      <UnitCardContent lessonCountHeader={lessonCountHeader} {...props} />
    </OakFlex>
  );
}
