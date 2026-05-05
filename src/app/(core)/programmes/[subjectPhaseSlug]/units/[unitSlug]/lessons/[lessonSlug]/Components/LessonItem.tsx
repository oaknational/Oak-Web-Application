import { OakFlex, OakHeading, OakBox } from "@oaknational/oak-components";

import { LessonResource } from "./getLessonResources";

import {
  getPreselectedDownloadFromTitle,
  getContainerId,
} from "@/components/TeacherComponents/LessonItemContainer/LessonItemContainer";
import { LessonItemContainerLink } from "@/components/TeacherComponents/LessonItemContainerLink";
import LessonPlayAllButton from "@/components/TeacherComponents/LessonPlayAllButton";
import { DownloadResourceButtonNameValueType } from "@/browser-lib/avo/Avo";
import { TrackingCallbackProps } from "@/components/TeacherComponents/LessonOverviewMediaClips";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";

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
  const { title } = resource;
  const preselectedDownload = resource.downloadable
    ? getPreselectedDownloadFromTitle(resource.title)
    : null;

  const downloadTitle = resource.downloadTitle;
  return (
    <OakBox as="section" className="anchor-section" id={resource.anchorId}>
      <OakFlex
        $flexDirection="column"
        $position={"relative"}
        id={getContainerId(resource.anchorId)}
        tabIndex={-1}
      >
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
            {resource.resourceType === "media-clips" && slugs && (
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
                isIntegratedJourney
                {...slugs}
              />
            )}
            {resource.skipLinkUrl && (
              <SkipLink href={resource.skipLinkUrl}>
                {`Skip ${downloadTitle || title.toLowerCase()}`}
              </SkipLink>
            )}
          </OakFlex>
        </OakFlex>

        <OakBox>{resource.component}</OakBox>
      </OakFlex>
    </OakBox>
  );
}
