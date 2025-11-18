import React, { forwardRef, useState } from "react";
import {
  OakHeading,
  OakFlex,
  OakSecondaryButton,
  OakThemeProvider,
  oakDefaultTheme,
  OakHandDrawnHR,
  OakBox,
  OakAnchorTarget,
} from "@oaknational/oak-components";

import { getPageLinksForLesson } from "../helpers/lessonHelpers/getPageLinksForLessons";

import { getSkipLinkUrl } from "./getSkipLinkUrl";

import { LessonPageLinkAnchorId } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { containerTitleToPreselectMap } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/containerTitleToPreselectMap";
import { LessonItemContainerLink } from "@/components/TeacherComponents/LessonItemContainerLink";
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
  | "Prior knowledge starter quiz"
  | "Assessment exit quiz"
  | "Lesson slides"
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
  downloadTitle?: string;
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
  subheader?: React.ReactNode;
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
    downloadTitle,
    downloadable,
    displayMediaClipButton,
    onDownloadButtonClick,
    slugs,
    anchorId,
    shareable,
    pageLinks,
    isCanonical,
    onPlayALLMediaClipButtonClick: onPlayAllMediaClipButtonClick,
    subheader,
  } = props;
  const preselectedDownload = getPreselectedDownloadFromTitle(
    title as DownloadableLessonTitles,
  );
  const preselectedShare = getPreselectedQueryFromTitle(
    title as DownloadableLessonTitles,
  );
  const [skipVideoButtonFocused, setSkipVideoButtonFocused] =
    useState<boolean>(false);

  const skipLinkUrl = getSkipLinkUrl(anchorId, pageLinks, slugs?.lessonSlug);

  const lowerCaseTitle = downloadTitle
    ? downloadTitle.toLowerCase()
    : title.toLowerCase();

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex
        $flexDirection="column"
        $position={"relative"}
        id={getContainerId(anchorId)}
        tabIndex={-1}
      >
        <OakAnchorTarget id={anchorId} $pt={"spacing-24"} ref={ref} />
        <OakFlex
          $mb={
            skipLinkUrl
              ? ["spacing-12", "spacing-24", "spacing-24"]
              : ["spacing-24"]
          }
          $position={"relative"}
          $flexDirection={"column"}
          $gap={"spacing-12"}
        >
          <OakFlex
            $flexDirection={["column", "row"]}
            $alignItems={["start", "end"]}
            $gap={["spacing-12", "spacing-40"]}
            $height={["auto", "spacing-40"]}
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
                onTrackingCallback={onPlayAllMediaClipButtonClick}
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

            {skipLinkUrl && (
              <OakSecondaryButton
                element="a"
                href={skipLinkUrl}
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
          {subheader && (
            <OakFlex $flexDirection="column" $maxWidth={"spacing-640"}>
              <OakHeading tag="h3" $font={"body-2"}>
                {subheader}
              </OakHeading>
            </OakFlex>
          )}
        </OakFlex>

        <OakBox>{children}</OakBox>
        {!props.isFinalElement && (
          <OakHandDrawnHR
            data-testid="hr"
            hrColor={"pink"}
            $height={"spacing-4"}
            $mt={["spacing-24", "spacing-56"]}
            $mb={["spacing-12", "spacing-24"]}
          />
        )}
      </OakFlex>
    </OakThemeProvider>
  );
});
