import { forwardRef, useState } from "react";
import {
  OakHeading,
  OakFlex,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import {
  getPageLinksForLesson,
  LessonPageLinkAnchorId,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { containerTitleToPreselectMap } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/containerTitleToPreselectMap";
import { LessonItemContainerLink } from "@/components/TeacherComponents/LessonItemContainerLink";
import { Hr } from "@/components/SharedComponents/Typography";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import Box from "@/components/SharedComponents/Box";

export const getContainerId = (anchorId: string) => {
  return `${anchorId}-container`;
};

/**
 * This replaces the old ExpandingContainer component on the lesson page. It should wrap each item of lesson content.
 *
 */
export type LessonItemTitle =
  | "Slide deck"
  | "Exit quiz"
  | "Starter quiz"
  | "Worksheet"
  | "Video"
  | "Transcript"
  | "Lesson details"
  | "Additional material";

type Slugs = {
  lessonSlug: string;
  unitSlug: string | null;
  programmeSlug: string | null;
};

export interface LessonItemContainerProps {
  children?: React.ReactNode;
  title: LessonItemTitle;
  anchorId: LessonPageLinkAnchorId;
  downloadable?: boolean;
  shareable?: boolean;
  slugs?: Slugs;
  onDownloadButtonClick?: () => void;
  isFinalElement?: boolean;
  isSpecialist: boolean;
  pageLinks: ReturnType<typeof getPageLinksForLesson>;
}

const getPreselectedDownloadFromTitle = (title: LessonItemTitle) => {
  return containerTitleToPreselectMap[title]?.downloadType;
};

const getPreselectedQueryFromTitle = (title: LessonItemTitle) => {
  return containerTitleToPreselectMap[title]?.shareType;
};

export const LessonItemContainer = forwardRef<
  HTMLDivElement,
  LessonItemContainerProps
>((props, ref) => {
  const {
    children,
    title,
    downloadable,
    onDownloadButtonClick,
    slugs,
    anchorId,
    shareable,
    pageLinks,
  } = props;
  const preselectedDownload = getPreselectedDownloadFromTitle(title);
  const preselectedShare = getPreselectedQueryFromTitle(title);
  const [skipVideoButtonFocused, setSkipVideoButtonFocused] =
    useState<boolean>(false);

  const skipContentAnchor =
    pageLinks[pageLinks.findIndex((link) => link.anchorId === anchorId) + 1]
      ?.anchorId || pageLinks[0]?.anchorId;

  const lowerCaseTitle = title.toLowerCase();

  return (
    <OakFlex
      $flexDirection="column"
      $position={"relative"}
      id={getContainerId(anchorId)}
      tabIndex={-1}
    >
      <AnchorTarget id={anchorId} $paddingTop={24} ref={ref} />
      <OakFlex
        $flexDirection={["column", "row"]}
        $alignItems={["start", "end"]}
        $gap={["all-spacing-3", "all-spacing-8"]}
        $mb={["space-between-m"]}
        $position={"relative"}
      >
        {title && (
          <OakHeading $font={["heading-5", "heading-4"]} tag={"h2"}>
            {title}
          </OakHeading>
        )}
        {downloadable && slugs && (
          <LessonItemContainerLink
            page={"download"}
            resourceTitle={lowerCaseTitle}
            onClick={onDownloadButtonClick}
            preselected={preselectedDownload}
            isSpecialist={props.isSpecialist}
            {...slugs}
          />
        )}
        {shareable && slugs && (
          <LessonItemContainerLink
            page={"share"}
            resourceTitle={lowerCaseTitle}
            onClick={onDownloadButtonClick}
            preselected={preselectedShare}
            isSpecialist={props.isSpecialist}
            {...slugs}
          />
        )}
        {skipContentAnchor && (
          <OakSecondaryButton
            onClick={() => {
              document.getElementById(skipContentAnchor)?.scrollIntoView();
              document
                .getElementById(getContainerId(skipContentAnchor))
                ?.focus();
            }}
            onFocus={() => setSkipVideoButtonFocused(true)}
            onBlur={() => setSkipVideoButtonFocused(false)}
            style={
              skipVideoButtonFocused
                ? {}
                : { position: "absolute", left: "-1000px", opacity: 0 }
            }
          >
            {`Skip ${lowerCaseTitle}`}
          </OakSecondaryButton>
        )}
      </OakFlex>

      <Box>{children}</Box>
      {!props.isFinalElement && (
        <Hr $color={"pink"} $mt={[24, 56]} $mb={[12, 24]} />
      )}
    </OakFlex>
  );
});
