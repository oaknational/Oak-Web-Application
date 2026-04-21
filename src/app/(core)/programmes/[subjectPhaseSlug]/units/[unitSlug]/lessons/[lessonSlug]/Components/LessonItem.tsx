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
import { DownloadResourceButtonNameValueType } from "@/browser-lib/avo/Avo";
import { TrackingCallbackProps } from "@/components/TeacherComponents/LessonOverviewMediaClips";

export function LessonItem({
  resource,
  slugs,
  onDownloadButtonClick,
  onMediaClipsButtonClick,
}: Readonly<{
  resource: LessonResource;
  slugs: {
    lessonSlug: string;
    unitSlug: string | null;
    programmeSlug: string | null;
  };
  onDownloadButtonClick: (props: {
    downloadResourceButtonName: DownloadResourceButtonNameValueType;
  }) => void;
  onMediaClipsButtonClick: (props: TrackingCallbackProps) => void;
}>) {
  const [skipResourceButtonFocused, setSkipResourceButtonFocused] =
    useState(false);
  const { title } = resource;
  const preselectedDownload = getPreselectedDownloadFromTitle(
    title as DownloadableLessonTitles,
  );

  const downloadTitle = resource.downloadTitle;

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
                onMediaClipsButtonClick({
                  mediaClipsButtonName: "play all",
                  learningCycle: "n/a",
                });
              }}
            />
          )}
          {resource.downloadable && slugs && (
            <LessonItemContainerLink
              page={"download"}
              resourceTitle={downloadTitle!}
              onClick={() => {
                onDownloadButtonClick({
                  downloadResourceButtonName: resource.trackingTitle!,
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
