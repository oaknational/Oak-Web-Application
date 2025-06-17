import { FC, MutableRefObject } from "react";
import {
  OakP,
  OakSpan,
  OakFlex,
  OakTagFunctional,
} from "@oaknational/oak-components";

import { DisabledListItemHeader } from "../ListItemHeader/ListItemHeader";

import useClickableCard from "@/hooks/useClickableCard";
import LessonResourceGraphics from "@/components/TeacherComponents/LessonResourceGraphics";
import ListItemHeader from "@/components/TeacherComponents/ListItemHeader";
import ListItemCard from "@/components/TeacherComponents/ListItemCard";
import { LessonResourceGraphicsItemProps } from "@/components/TeacherComponents/LessonResourceGraphicsItem";
import { LessonListingPageData } from "@/node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import ListItemIndexMobile from "@/components/TeacherComponents/ListItemIndexMobile";
import ListItemIndexDesktop from "@/components/TeacherComponents/ListItemIndexDesktop";
import { OakColorName } from "@/styles/theme";
import { SpecialistLesson } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";
import { UnpublishedLessonListItem } from "@/node-lib/curriculum-api-2023/shared.schema";

export type LessonListItemProps = LessonListingPageData["lessons"][number] & {
  programmeSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  keyStageSlug: string;
  keyStageTitle: string;
  unitSlug: string;
  unitTitle: string;
  yearSlug: string;
  yearTitle: string;
  hideTopHeading?: boolean;
  hitCount?: number;
  index: number;
  currentPage?: number;
  firstItemRef?: MutableRefObject<HTMLAnchorElement | null> | null;
  onClick: (props: LessonListItemProps | SpecialistLessonListItemProps) => void;
  isUnpublished: false;
  hasCopyrightMaterial: boolean;
};

type UnpublishedLessonListItemProps = UnpublishedLessonListItem & {
  index: number;
  firstItemRef?: MutableRefObject<HTMLAnchorElement | null> | null;
  unitTitle: string;
  hideTopHeading?: boolean;
  onClick: (props: LessonListItemProps | SpecialistLessonListItemProps) => void;
};

export const isLessonListItem = (
  u: LessonListItemProps | SpecialistLesson | UnpublishedLessonListItem,
): u is LessonListItemProps => {
  return (u as LessonListItemProps).programmeSlug !== undefined;
};

export const isUnpublishedLessonListItem = (
  u: LessonListItemProps | UnpublishedLessonListItem | SpecialistLesson,
): u is UnpublishedLessonListItem => {
  return (u as UnpublishedLessonListItem).isUnpublished === true;
};

export type SpecialistLessonListItemProps = SpecialistLesson & {
  unitTitle: string;
  hideTopHeading?: boolean;
  hitCount?: number;
  index: number;
  currentPage?: number;
  firstItemRef?: MutableRefObject<HTMLAnchorElement | null> | null;
  onClick: (props: SpecialistLessonListItemProps | LessonListItemProps) => void;
};

function getAvailableResourceList({
  quizCount,
  videoCount,
  presentationCount,
  worksheetCount,
  hasCopyrightMaterial,
}: LessonListItemProps | SpecialistLessonListItemProps) {
  const resources: LessonResourceGraphicsItemProps[] = [];

  if (presentationCount && !hasCopyrightMaterial) {
    resources.push({
      titleSingular: "Slide deck",
      titlePlural: "Slide decks",
      icon: "slide-deck",
      resourceCount: presentationCount,
    });
  }

  if (worksheetCount) {
    resources.push({
      titleSingular: "Worksheet",
      titlePlural: "Worksheets",
      icon: "worksheet",
      resourceCount: worksheetCount,
    });
  }

  if (quizCount) {
    resources.push({
      titleSingular: "Quiz",
      titlePlural: "Quizzes",
      icon: "quiz",
      resourceCount: quizCount,
    });
  }

  if (videoCount) {
    resources.push({
      titleSingular: "Video",
      titlePlural: "Videos",
      icon: "video",
      resourceCount: videoCount,
    });
  }

  return resources;
}

/**
 * Contains a lesson title, description, icon, and icons for resources
 * Links to a lesson-index page
 */
const LessonListItem: FC<
  | LessonListItemProps
  | SpecialistLessonListItemProps
  | UnpublishedLessonListItemProps
> = (props) => {
  const { lessonTitle, lessonSlug, index, firstItemRef, onClick } = props;

  const isUnpublishedLesson = isUnpublishedLessonListItem(props);

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>(firstItemRef);

  const disabled = isUnpublishedLesson ? props.isUnpublished : props.expired;

  const resources = isUnpublishedLesson
    ? undefined
    : getAvailableResourceList(props);

  const background =
    (isUnpublishedLesson && props.isUnpublished) || props.expired
      ? "grey30"
      : "pink";
  const backgroundOnHover: OakColorName = "pink60";

  const showCopyrightedTag = !isUnpublishedLesson && props.hasCopyrightMaterial;

  return (
    <ListItemCard
      title={lessonTitle}
      subjectSlug={isUnpublishedLesson ? "" : props.subjectSlug}
      index={index}
      isHovered={isHovered}
      background={disabled ? "grey20" : "white"}
      containerProps={containerProps}
      disabled={disabled}
      key={`LessonList-LessonListItem-${lessonSlug}`}
      data-testid={"lesson-list-item"}
    >
      <ListItemIndexDesktop
        index={index + 1}
        background={isHovered && !disabled ? backgroundOnHover : background}
        disabled={disabled}
      />

      <OakFlex
        $flexDirection={"column"}
        $width={"100%"}
        $gap={["all-spacing-1", "all-spacing-3"]}
        $pa={["inner-padding-none", "inner-padding-xl"]}
      >
        <OakFlex $alignItems={"flex-start"}>
          <ListItemIndexMobile background={background} index={index + 1} />
          <OakFlex
            $flexDirection={"column"}
            $height={"100%"}
            $pa={["inner-padding-m", "inner-padding-none"]}
          >
            {disabled || isUnpublishedLesson ? (
              <DisabledListItemHeader index={index} itemTitle={lessonTitle} />
            ) : (
              <ListItemHeader
                {...props}
                primaryTargetProps={primaryTargetProps}
                page="Lesson"
                index={index}
                onClick={() => onClick({ ...props })}
                title={lessonTitle}
                slug={lessonSlug}
              />
            )}
          </OakFlex>
        </OakFlex>
        <OakFlex
          $flexDirection={"column"}
          $gap={["all-spacing-3"]}
          $pl={["inner-padding-m", "inner-padding-none"]}
          $pr={["inner-padding-m", "inner-padding-none"]}
          $pt={["inner-padding-s", "inner-padding-none"]}
          $pb={["inner-padding-s", "inner-padding-none"]}
        >
          <OakFlex
            $mt={["space-between-ssx", "space-between-none"]}
            $mr={["space-between-s", "space-between-none"]}
          >
            {isUnpublishedLesson ? (
              <OakP
                $mt="space-between-ssx"
                $font={["body-3", "body-2"]}
                $color="text-disabled"
              >
                Coming soon...
              </OakP>
            ) : props.expired ? (
              <OakP $mt="space-between-ssx" $font={["body-3", "body-2"]}>
                This lesson is currently unavailable.
              </OakP>
            ) : (
              <>
                {props.description ? (
                  <OakSpan
                    dangerouslySetInnerHTML={{
                      __html: props.description,
                    }}
                    $font={["body-3", "body-2"]}
                    $color={"grey70"}
                  />
                ) : (
                  <OakP $font={["body-3", "body-2"]} $color={"grey70"}>
                    {props.pupilLessonOutcome}
                  </OakP>
                )}
              </>
            )}
          </OakFlex>
          {resources && resources.length > 0 && !disabled && (
            <OakFlex
              $width="100%"
              $justifyContent="space-between"
              $alignItems={"center"}
              $flexWrap={"wrap"}
              $gap={"all-spacing-2"}
            >
              <LessonResourceGraphics items={resources} />
              {showCopyrightedTag && (
                <OakTagFunctional
                  iconName="copyright"
                  isTrailingIcon
                  $maxHeight={"all-spacing-7"}
                  $borderRadius={"border-radius-s"}
                  $borderStyle={"solid"}
                  $background={"grey20"}
                  label="Copyrighted"
                />
              )}
            </OakFlex>
          )}
        </OakFlex>
      </OakFlex>
    </ListItemCard>
  );
};

export default LessonListItem;
