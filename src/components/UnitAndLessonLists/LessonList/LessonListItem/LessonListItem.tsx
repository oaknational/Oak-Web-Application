import { FC, MutableRefObject } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import LessonResourceGraphics from "../../../LessonResourceGraphics";
import Box from "../../../Box";
import ListItemHeader from "../../ListItemHeader";
import { P, Span } from "../../../Typography";
import ListItemCard from "../../ListItemCard";
import { LessonResourceGraphicsItemProps } from "../../../LessonResourceGraphics/LessonResourceGraphicsItem";
import { LessonListingPageData } from "../../../../node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import ListItemIndexMobile from "../../ListItemIndexMobile";
import ListItemIndexDesktop from "../../ListItemIndexDesktop";

import { OakColorName } from "@/styles/theme";

export type LessonListItemProps = LessonListingPageData["lessons"][number] & {
  programmeSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  keyStageSlug: string;
  keyStageTitle: string;
  unitSlug: string;
  unitTitle: string;
  hideTopHeading?: boolean;
  hitCount?: number;
  index: number;
  currentPage?: number;
  firstItemRef?: MutableRefObject<HTMLAnchorElement | null> | null;
  onClick: (props: LessonListItemProps) => void;
};

function getAvailableResourceList({
  quizCount,
  videoCount,
  presentationCount,
  worksheetCount,
  hasCopyrightMaterial,
}: LessonListItemProps) {
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
const LessonListItem: FC<LessonListItemProps> = (props) => {
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

  return (
    <ListItemCard
      title={lessonTitle}
      subjectSlug={subjectSlug}
      index={index}
      isHovered={isHovered}
      background={expired ? "grey20" : "white"}
      containerProps={containerProps}
      expired={expired}
    >
      <ListItemIndexDesktop
        index={index + 1}
        background={isHovered && !expired ? backgroundOnHover : background}
        expired={expired}
      />

      <Flex
        $flexDirection={"column"}
        $width={"100%"}
        $gap={[4, 12]}
        $pa={[0, 24]}
      >
        <Flex $alignItems={"flex-start"}>
          <ListItemIndexMobile background={background} index={index + 1} />
          <Flex $flexDirection={"column"} $height={"100%"} $pa={[16, 0]}>
            <ListItemHeader
              {...props}
              primaryTargetProps={primaryTargetProps}
              page="Lesson"
              index={index}
              onClick={() => onClick({ ...props })}
              title={lessonTitle}
              slug={lessonSlug}
            />
            {/* {expired && (
                <P $mt={8} $font={["body-3", "body-2"]}>
                  This lesson is currently unavailable.
                </P>
              )} */}
          </Flex>
        </Flex>
        <Flex
          $flexDirection={"column"}
          $gap={[12]}
          $pl={[16, 0]}
          $pr={[16, 0]}
          $pt={[12, 0]}
          $pb={[12, 0]}
        >
          <Flex $mt={[8, 0]} $mr={[16, 0]}>
            {expired ? (
              <P $mt={8} $font={["body-3", "body-2"]}>
                This lesson is currently unavailable.
              </P>
            ) : (
              <>
                {description ? (
                  <Span
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                    $font={["body-3", "body-2"]}
                    $color={"grey70"}
                  />
                ) : (
                  <P $font={["body-3", "body-2"]} $color={"grey70"}>
                    {pupilLessonOutcome}
                  </P>
                )}
              </>
            )}
          </Flex>
          {resources.length > 0 && !expired && (
            <Box>
              <LessonResourceGraphics items={resources} />
            </Box>
          )}
        </Flex>
      </Flex>
    </ListItemCard>
  );
};

export default LessonListItem;
