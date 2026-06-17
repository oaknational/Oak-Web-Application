import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";
import { OakBackLink, OakP } from "@oaknational/oak-components";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { hasValidSharedVariant } from "@/pages-helpers/pupil/lessons-pages/validateSharedVariant";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { getPupilPathwayData } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import { PupilLessonIntroAdditionalFileItem } from "@/components/PupilComponents/Views/PupilLessonIntro";
import {
  PupilLessonVideoAdditionalFilesCard,
  PupilLessonVideoTranscript,
  PupilLessonVideoView,
} from "@/components/PupilComponents/Views/PupilLessonVideo";
import { usePupilVideoExperience } from "@/components/PupilComponents/Views/Hooks";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer/VideoPlayer";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

type VideoPageURLParams = {
  lessonSlug: string;
};

const VideoPageContent = ({
  browseData,
  lessonContent,
  hasAdditionalFiles,
  additionalFiles,
}: Pick<
  PupilLessonPageProps,
  "browseData" | "lessonContent" | "hasAdditionalFiles" | "additionalFiles"
>) => {
  const {
    overviewHref,
    playbackId,
    proceedLabel,
    transcriptSentences,
    signLanguageOn,
    isAdditionalFilesDownloading,
    videoInitialTimeElapsed,
    handleVideoEvent,
    handleBackToOverview,
    handleProceed,
    handleTranscriptToggled,
    handleSignLanguageToggle,
    handleAdditionalFilesDownload,
  } = usePupilVideoExperience({ browseData, lessonContent, additionalFiles });

  return (
    <PupilLessonVideoView
      phase={browseData.programmeFields.phase as "primary" | "secondary"}
      topNav={{
        backLinkSlot: (
          <OakBackLink
            href={overviewHref}
            label="Back to overview"
            onClick={(event) => {
              event.preventDefault();
              handleBackToOverview();
            }}
          />
        ),
      }}
      bottomNav={{
        proceedLabel,
        onProceed: handleProceed,
      }}
      videoSlot={
        playbackId ? (
          <VideoPlayer
            playbackId={playbackId}
            playbackPolicy="signed"
            initialStartTime={videoInitialTimeElapsed}
            title={lessonContent.lessonTitle ?? ""}
            location="pupil"
            isLegacy={lessonContent.isLegacy ?? false}
            userEventCallback={handleVideoEvent}
            pathwayData={getPupilPathwayData(browseData)}
          />
        ) : (
          <OakP $font="body-1">This lesson does not contain a video</OakP>
        )
      }
      transcriptSlot={
        <PupilLessonVideoTranscript
          transcriptSentences={transcriptSentences}
          onTranscriptToggled={handleTranscriptToggled}
          showSignLanguageToggle={Boolean(
            lessonContent.videoWithSignLanguageMuxPlaybackId,
          )}
          signLanguageOn={signLanguageOn}
          onSignLanguageToggle={handleSignLanguageToggle}
        />
      }
      additionalFilesSlot={
        <PupilLessonVideoAdditionalFilesCard
          hasAdditionalFiles={hasAdditionalFiles}
          filesCount={additionalFiles?.length ?? 0}
          isDownloading={isAdditionalFilesDownloading}
          onDownload={handleAdditionalFilesDownload}
          filesListSlot={additionalFiles?.map((file) => (
            <PupilLessonIntroAdditionalFileItem
              key={file.assetId}
              displayName={file.mediaObject.displayName}
              bytes={file.mediaObject.bytes}
              url={file.mediaObject.url}
            />
          ))}
        />
      }
    />
  );
};

const PupilLessonVideoNewPage = (props: PupilLessonPageProps) => {
  const { browseData, lessonContent, variant } = props;

  return (
    <PupilLayout
      seoProps={{
        ...getSeoProps({
          title: browseData.lessonData.title,
          description: browseData.lessonData.pupilLessonOutcome,
        }),
        noIndex: true,
      }}
      pupilStores={{ browseData, lessonContent, variant }}
    >
      <VideoPageContent {...props} />
    </PupilLayout>
  );
};

export default PupilLessonVideoNewPage;

export const getStaticPaths = getStaticPathsTemplate<VideoPageURLParams>;

export const getStaticProps: GetStaticProps<
  PupilLessonPageProps,
  VideoPageURLParams
> = async (context) => {
  if (!hasValidSharedVariant(context)) {
    return { notFound: true };
  }

  const contextWithSection = {
    ...context,
    params: context.params
      ? {
          ...context.params,
          section: "video",
        }
      : undefined,
  } as GetStaticPropsContext<PupilLessonPageURLParams, PreviewData>;

  return getPageProps({
    page: "pupils-lesson-new-video::getStaticProps",
    context,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
