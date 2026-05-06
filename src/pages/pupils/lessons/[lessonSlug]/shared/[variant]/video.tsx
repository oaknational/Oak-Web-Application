import { ParsedUrlQuery } from "querystring";

import { useMemo, useRef, useState } from "react";
import { GetStaticProps, GetStaticPropsContext, PreviewData } from "next";
import { useRouter } from "next/router";
import { OakBackLink, OakP } from "@oaknational/oak-components";
import { useShallow } from "zustand/react/shallow";

import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import {
  getProps,
  PupilLessonPageURLParams,
} from "@/pages-helpers/pupil/lessons-pages/getProps";
import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { getPupilPathwayData } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import { PupilLessonIntroAdditionalFileItem } from "@/components/PupilComponents/Views/PupilLessonIntro";
import {
  PupilLessonVideoAdditionalFilesCard,
  PupilLessonVideoTranscript,
  PupilLessonVideoView,
} from "@/components/PupilComponents/Views/PupilLessonVideo";
import {
  getAdditionalFileAssetIds,
  getNewLessonSectionHref,
  getNarrowTranscriptSentences,
  getVideoPlaybackId,
  pickNextIncompleteSection,
  shouldPersistVideoTimeElapsed,
} from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { useAdditionalFilesDownload } from "@/components/PupilViews/PupilIntro/useAdditionalFilesDownload";
import VideoPlayer, {
  VideoEventCallbackArgs,
} from "@/components/SharedComponents/VideoPlayer/VideoPlayer";
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
  const router = useRouter();
  const [signLanguageOn, setSignLanguageOn] = useState(false);
  const {
    sectionResults,
    lessonReviewSections,
    isReadOnly,
    completeSection,
    updateSectionInProgressResult,
    markLessonStarted,
  } = usePupilLessonProgress(
    useShallow((state) => ({
      sectionResults: state.sectionResults,
      lessonReviewSections: state.lessonReviewSections,
      isReadOnly: state.isReadOnly,
      completeSection: state.completeSection,
      updateSectionInProgressResult: state.updateSectionInProgressResult,
      markLessonStarted: state.markLessonStarted,
    })),
  );
  const { trackSectionStarted } = usePupilLessonAnalytics();

  const additionalFilesAssetIds = useMemo(
    () => getAdditionalFileAssetIds(additionalFiles),
    [additionalFiles],
  );
  const { startAdditionalFilesDownload, isAdditionalFilesDownloading } =
    useAdditionalFilesDownload(browseData.lessonSlug, additionalFilesAssetIds);
  const [isCompletingAndRedirecting, setIsCompletingAndRedirecting] =
    useState(false);

  const transcriptSentences = getNarrowTranscriptSentences(
    lessonContent.transcriptSentences,
  );
  const currentSearchParams = useMemo(
    () => new URLSearchParams(router.asPath.split("?")[1]),
    [router.asPath],
  );
  const overviewHref = getNewLessonSectionHref({
    currentRoute: router.asPath,
    section: "overview",
    searchParams: currentSearchParams,
  });
  const playbackId = getVideoPlaybackId({
    signLanguageOn,
    videoMuxPlaybackId: lessonContent.videoMuxPlaybackId ?? undefined,
    videoWithSignLanguageMuxPlaybackId:
      lessonContent.videoWithSignLanguageMuxPlaybackId ?? undefined,
  });

  const videoResultRef = useRef({
    played: sectionResults.video?.played || false,
    duration: sectionResults.video?.duration || 0,
    timeElapsed: sectionResults.video?.timeElapsed || 0,
    muted: sectionResults.video?.muted || false,
    signedOpened: sectionResults.video?.signedOpened || false,
    transcriptOpened: sectionResults.video?.transcriptOpened || false,
  });

  const handleVideoEvent = ({
    event,
    timeElapsed,
    duration,
    muted,
  }: VideoEventCallbackArgs) => {
    videoResultRef.current.played = true;
    videoResultRef.current.duration = duration || 0;
    videoResultRef.current.muted = muted || false;

    const nextTimeElapsed = timeElapsed || 0;
    if (
      shouldPersistVideoTimeElapsed({
        event,
        nextTimeElapsed,
        currentTimeElapsed: videoResultRef.current.timeElapsed,
        currentSection: "video",
      })
    ) {
      videoResultRef.current.timeElapsed = nextTimeElapsed;
      updateSectionInProgressResult("video", videoResultRef.current);
    }
  };

  const handleBackToOverview = () => {
    markLessonStarted();
    void router.push(overviewHref);
  };

  const getSectionResultsAfterComplete = () => ({
    ...sectionResults,
    video: {
      ...sectionResults.video,
      isComplete: true,
    },
  });

  const getPostCompleteSection = () => {
    const nextSectionResults = getSectionResultsAfterComplete();
    return lessonReviewSections.every(
      (section) => nextSectionResults[section]?.isComplete,
    )
      ? "review"
      : "overview";
  };

  const handleProceed = () => {
    if (!sectionResults.video?.isComplete) {
      setIsCompletingAndRedirecting(true);
      completeSection("video");
      void router.push(
        getNewLessonSectionHref({
          currentRoute: router.asPath,
          section: getPostCompleteSection(),
          searchParams: currentSearchParams,
        }),
      );
      return;
    }

    const nextSection = pickNextIncompleteSection({
      lessonReviewSections,
      sectionResults,
    });

    if (isReadOnly) {
      trackSectionStarted({ section: "review", sectionResults });
      void router.push(
        getNewLessonSectionHref({
          currentRoute: router.asPath,
          section: "review",
          searchParams: currentSearchParams,
        }),
      );
      return;
    }

    trackSectionStarted({ section: nextSection, sectionResults });
    void router.push(
      getNewLessonSectionHref({
        currentRoute: router.asPath,
        section: nextSection,
        searchParams: currentSearchParams,
      }),
    );
  };

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
        proceedLabel: isCompletingAndRedirecting
          ? "I've finished the video"
          : sectionResults.video?.isComplete
            ? "Continue lesson"
            : "I've finished the video",
        onProceed: handleProceed,
      }}
      videoSlot={
        playbackId ? (
          <VideoPlayer
            playbackId={playbackId}
            playbackPolicy="signed"
            initialStartTime={sectionResults.video?.timeElapsed ?? 0}
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
          onTranscriptToggled={({ isOpen }) => {
            if (!isOpen) return;
            videoResultRef.current.transcriptOpened = true;
            updateSectionInProgressResult("video", videoResultRef.current);
          }}
          showSignLanguageToggle={Boolean(
            lessonContent.videoWithSignLanguageMuxPlaybackId,
          )}
          signLanguageOn={signLanguageOn}
          onSignLanguageToggle={() => {
            const isTurningOn = !signLanguageOn;
            setSignLanguageOn(isTurningOn);
            if (!isTurningOn) return;

            videoResultRef.current.signedOpened = true;
            updateSectionInProgressResult("video", videoResultRef.current);
          }}
        />
      }
      additionalFilesSlot={
        <PupilLessonVideoAdditionalFilesCard
          hasAdditionalFiles={hasAdditionalFiles}
          filesCount={additionalFiles?.length ?? 0}
          isDownloading={isAdditionalFilesDownloading}
          onDownload={() => {
            updateSectionInProgressResult("intro", {
              filesDownloaded: true,
              additionalFilesAvailable: true,
            });
            void startAdditionalFilesDownload();
          }}
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
    context: context as GetStaticPropsContext<ParsedUrlQuery, PreviewData>,
    getProps: getProps({ context: contextWithSection, page: "canonical" }),
  });
};
