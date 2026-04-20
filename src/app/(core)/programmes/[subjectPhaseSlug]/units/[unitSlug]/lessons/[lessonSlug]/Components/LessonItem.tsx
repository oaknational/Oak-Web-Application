import {
  OakFlex,
  OakAnchorTarget,
  OakHeading,
  OakSecondaryButton,
  OakBox,
} from "@oaknational/oak-components";
import { useState } from "react";

import { LessonResource } from "./getLessonResources";

import {
  getPreselectedDownloadFromTitle,
  getContainerId,
} from "@/components/TeacherComponents/LessonItemContainer/LessonItemContainer";
import { LessonItemContainerLink } from "@/components/TeacherComponents/LessonItemContainerLink";
import LessonPlayAllButton from "@/components/TeacherComponents/LessonPlayAllButton";
import { DownloadableLessonTitles } from "@/components/TeacherComponents/types/downloadAndShare.types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { AnalyticsBrowseData } from "@/components/TeacherComponents/types/lesson.types";

export function LessonItem({
  browsePathwayData,
  resource,
  slugs,
}: Readonly<{
  browsePathwayData: AnalyticsBrowseData;
  resource: LessonResource;
  slugs: {
    lessonSlug: string;
    unitSlug: string | null;
    programmeSlug: string | null;
  };
}>) {
  const { track } = useAnalytics();
  const [skipResourceButtonFocused, setSkipResourceButtonFocused] =
    useState(false);
  const { title } = resource;
  const preselectedDownload = getPreselectedDownloadFromTitle(
    title as DownloadableLessonTitles,
  );

  const downloadTitle = resource.downloadTitle
    ? resource.downloadTitle
    : title.toLowerCase();

  return (
    <OakFlex
      $flexDirection="column"
      $position={"relative"}
      id={getContainerId(title)}
      tabIndex={-1}
    >
      <OakAnchorTarget id={resource.key} $pt={"spacing-24"} />
      <OakFlex
        $mb={
          resource.skipLinkUrl
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
          {resource.key === "media-clips" && slugs && (
            <LessonPlayAllButton
              {...slugs}
              onTrackingCallback={() => {
                track.lessonMediaClipsStarted({
                  platform: "owa",
                  product: "media clips",
                  engagementIntent: "use",
                  componentType: "go_to_media_clips_page_button",
                  eventVersion: "2.0.0",
                  analyticsUseCase: "Teacher",
                  mediaClipsButtonName: "play all",
                  learningCycle: "n/a",
                  ...browsePathwayData,
                });
              }}
            />
          )}
          {resource.downloadable && slugs && (
            <LessonItemContainerLink
              page={"download"}
              resourceTitle={downloadTitle}
              onClick={() => {
                track.lessonResourceDownloadStarted({
                  platform: "owa",
                  product: "teacher lesson resources",
                  engagementIntent: "use",
                  componentType: "lesson_download_button",
                  eventVersion: "2.0.0",
                  analyticsUseCase: "Teacher",
                  downloadResourceButtonName: resource.trackingTitle!,
                  ...browsePathwayData,
                });
              }}
              preselected={preselectedDownload}
              isSpecialist={false}
              {...slugs}
            />
          )}
          {resource.skipLinkUrl && (
            <OakSecondaryButton
              element="a"
              href={resource.skipLinkUrl}
              onFocus={() => setSkipResourceButtonFocused(true)}
              onBlur={() => setSkipResourceButtonFocused(false)}
              style={
                skipResourceButtonFocused
                  ? {}
                  : {
                      position: "absolute",
                      left: "-1000px",
                      opacity: 0,
                    }
              }
            >
              {`Skip ${downloadTitle}`}
            </OakSecondaryButton>
          )}
        </OakFlex>
      </OakFlex>

      <OakBox>{resource.component}</OakBox>
    </OakFlex>
  );
}
