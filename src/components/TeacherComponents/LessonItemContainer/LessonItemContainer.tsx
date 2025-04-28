import { forwardRef, useState } from "react";
import {
  OakHeading,
  OakFlex,
  OakSecondaryButton,
  OakThemeProvider,
  oakDefaultTheme,
  OakHandDrawnHR,
  OakBox,
} from "@oaknational/oak-components";

import {
  getPageLinksForLesson,
  LessonPageLinkAnchorId,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { containerTitleToPreselectMap } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/containerTitleToPreselectMap";
import { LessonItemContainerLink } from "@/components/TeacherComponents/LessonItemContainerLink";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import { DownloadableLessonTitles } from "@/components/TeacherComponents/types/downloadAndShare.types";
import LessonPlayAllButton from "@/components/TeacherComponents/LessonPlayAllButton/LessonPlayAllButton";

export const getContainerId = (anchorId: string) => {
  return `${anchorId}-container`;
};

/**
 * This replaces the old ExpandingContainer component on the lesson page. It should wrap each item of lesson content.
 *
 */
export type LessonItemTitle =
  | "Lesson guide"
  | "Slide deck"
  | "Exit quiz"
  | "Starter quiz"
  | "Worksheet"
  | "Lesson video"
  | "Transcript"
  | "Lesson details"
  | "Additional material"
  | "Demonstration videos"
  | "Audio clips"
  | "Video & audio clips";

export type Slugs = {
  lessonSlug: string;
  unitSlug: string | null;
  programmeSlug: string | null;
};

export interface LessonItemContainerProps {
  children?: React.ReactNode;
  title: LessonItemTitle | DownloadableLessonTitles;
  anchorId: LessonPageLinkAnchorId;
  downloadable?: boolean;
  shareable?: boolean;
  displayMediaClipButton?: boolean;
  slugs?: Slugs;
  onDownloadButtonClick?: () => void;
  onPlayALLMediaClipButtonClick?: () => void;
  isFinalElement?: boolean;
  isSpecialist: boolean;
  pageLinks: ReturnType<typeof getPageLinksForLesson>;
  isCanonical?: boolean;
}

const getPreselectedDownloadFromTitle = (title: DownloadableLessonTitles) => {
  return containerTitleToPreselectMap[title]?.downloadType;
};

const getPreselectedQueryFromTitle = (title: DownloadableLessonTitles) => {
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
    displayMediaClipButton,
    onDownloadButtonClick,
    slugs,
    anchorId,
    shareable,
    pageLinks,
    isCanonical,
    onPlayALLMediaClipButtonClick,
  } = props;
  const preselectedDownload = getPreselectedDownloadFromTitle(
    title as DownloadableLessonTitles,
  );
  const preselectedShare = getPreselectedQueryFromTitle(
    title as DownloadableLessonTitles,
  );
  const [skipVideoButtonFocused, setSkipVideoButtonFocused] =
    useState<boolean>(false);

  const skipContentAnchor =
    anchorId === "video" ||
    anchorId === "lesson-guide" ||
    anchorId === "worksheet" ||
    anchorId === "slide-deck" ||
    anchorId === "media-clips"
      ? pageLinks[pageLinks.findIndex((link) => link.anchorId === anchorId) + 1]
          ?.anchorId || undefined
      : undefined;

  const lowerCaseTitle = title.toLowerCase();

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
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
          $height={["auto", "inner-padding-xl3"]}
          $mb={
            skipContentAnchor
              ? ["space-between-xs", "space-between-m", "space-between-m"]
              : ["space-between-m"]
          }
          $position={"relative"}
        >
          {title && (
            <OakHeading $font={["heading-5", "heading-4"]} tag={"h2"}>
              {title}
            </OakHeading>
          )}
          {displayMediaClipButton && slugs && (
            <LessonPlayAllButton
              {...slugs}
              isCanonical={isCanonical}
              onTrackingCallback={onPlayALLMediaClipButtonClick}
            />
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
              element="a"
              href={`${slugs?.lessonSlug}#${skipContentAnchor}`}
              onFocus={() => setSkipVideoButtonFocused(true)}
              onBlur={() => setSkipVideoButtonFocused(false)}
              style={
                skipVideoButtonFocused
                  ? {}
                  : {
                      position: "absolute",
                      left: "-1000px",
                      opacity: 0,
                    }
              }
            >
              {`Skip ${lowerCaseTitle}`}
            </OakSecondaryButton>
          )}
        </OakFlex>

        <OakBox>{children}</OakBox>
        {!props.isFinalElement && (
          <OakHandDrawnHR
            data-testid="hr"
            hrColor={"pink"}
            $height={"all-spacing-1"}
            $mt={["space-between-m", "space-between-xl"]}
            $mb={["space-between-xs", "space-between-m"]}
          />
        )}
      </OakFlex>
    </OakThemeProvider>
  );
});
