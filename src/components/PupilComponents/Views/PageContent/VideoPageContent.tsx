import { OakBackLink, OakP } from "@oaknational/oak-components";

import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { getPupilPathwayData } from "@/context/PupilLessonAnalytics/pupilAnalyticsHelpers";
import { PupilLessonIntroAdditionalFileItem } from "@/components/PupilComponents/Views/PupilLessonIntro";
import {
  PupilLessonVideoAdditionalFilesCard,
  PupilLessonVideoTranscript,
  PupilLessonVideoView,
} from "@/components/PupilComponents/Views/PupilLessonVideo";
import { usePupilVideoExperience } from "@/components/PupilComponents/Views/Hooks";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer/VideoPlayer";
import { PupilLessonPageProps } from "@/pages-helpers/pupil/lessons-pages/pupilLessonPage.types";

const VideoContent = ({
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

/**
 * Video page shared by the canonical, browse and preview pupil lesson routes.
 */
const VideoPageContent = (props: PupilLessonPageProps) => {
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
      <VideoContent {...props} />
    </PupilLayout>
  );
};

export default VideoPageContent;
