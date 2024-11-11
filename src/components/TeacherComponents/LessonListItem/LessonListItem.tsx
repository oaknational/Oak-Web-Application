import { FC, MutableRefObject, useState } from "react";
import {
  OakP,
  OakSpan,
  OakFlex,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { SignInButton, useAuth } from "@clerk/nextjs";

import useClickableCard from "@/hooks/useClickableCard";
import LessonResourceGraphics from "@/components/TeacherComponents/LessonResourceGraphics";
import ListItemHeader from "@/components/TeacherComponents/ListItemHeader";
import ListItemCard from "@/components/TeacherComponents/ListItemCard";
import { LessonResourceGraphicsItemProps } from "@/components/TeacherComponents/LessonResourceGraphicsItem";
import { LessonListingPageData } from "@/node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import ListItemIndexMobile from "@/components/TeacherComponents/ListItemIndexMobile";
import ListItemIndexDesktop from "@/components/TeacherComponents/ListItemIndexDesktop";
import Box from "@/components/SharedComponents/Box";
import { OakColorName } from "@/styles/theme";
import { SpecialistLesson } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";
import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import { LEGACY_COHORT } from "@/config/cohort";

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
};

export const isLessonListItem = (
  u: LessonListItemProps | SpecialistLesson,
): u is LessonListItemProps => {
  return (u as LessonListItemProps).programmeSlug !== undefined;
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
  LessonListItemProps | SpecialistLessonListItemProps
> = (props) => {
  const {
    lessonTitle,
    lessonSlug,
    description,
    expired,
    subjectSlug,
    index,
    firstItemRef,
    pupilLessonOutcome,
    onClick,
  } = props;

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>(firstItemRef);

  const resources = getAvailableResourceList(props);

  const background = expired ? "grey30" : "pink";
  const backgroundOnHover: OakColorName = "pink60";

  const auth = useAuth();
  const isLoggedIn = auth.isSignedIn;
  const hasDownloads = isLessonListItem(props) && props.resources?.length;
  const [isLoading, setIsLoading] = useState(false);

  const onLessonDownloadClick = async () => {
    if (!hasDownloads) {
      return;
    }
    setIsLoading(true);
    const accessToken = await auth.getToken();
    try {
      await downloadLessonResources(
        lessonSlug,
        props.resources ?? [],
        props.lessonCohort === LEGACY_COHORT,
        true,
        accessToken,
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error downloading lesson resources", error);
    }
  };

  return (
    <ListItemCard
      title={lessonTitle}
      subjectSlug={subjectSlug}
      index={index}
      isHovered={isHovered}
      background={expired ? "grey20" : "white"}
      containerProps={containerProps}
      expired={expired}
      key={`LessonList-LessonListItem-${lessonSlug}`}
      data-testid={"lesson-list-item"}
    >
      <ListItemIndexDesktop
        index={index + 1}
        background={isHovered && !expired ? backgroundOnHover : background}
        expired={expired}
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
            <ListItemHeader
              {...props}
              primaryTargetProps={primaryTargetProps}
              page="Lesson"
              index={index}
              onClick={() => onClick({ ...props })}
              title={lessonTitle}
              slug={lessonSlug}
            />
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
            {expired ? (
              <OakP $mt="space-between-ssx" $font={["body-3", "body-2"]}>
                This lesson is currently unavailable.
              </OakP>
            ) : (
              <>
                {description ? (
                  <OakSpan
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                    $font={["body-3", "body-2"]}
                    $color={"grey70"}
                  />
                ) : (
                  <OakP $font={["body-3", "body-2"]} $color={"grey70"}>
                    {pupilLessonOutcome}
                  </OakP>
                )}
              </>
            )}
          </OakFlex>
          {resources.length > 0 && !expired && (
            <Box>
              <LessonResourceGraphics items={resources} />
            </Box>
          )}
        </OakFlex>
      </OakFlex>
      {isLoggedIn && hasDownloads ? (
        <OakPrimaryButton
          onClick={() => {
            onLessonDownloadClick();
          }}
          isLoading={isLoading}
        >
          Download Lesson
        </OakPrimaryButton>
      ) : (
        <OakPrimaryButton>
          <SignInButton>Sign in to download</SignInButton>
        </OakPrimaryButton>
      )}
    </ListItemCard>
  );
};

export default LessonListItem;
