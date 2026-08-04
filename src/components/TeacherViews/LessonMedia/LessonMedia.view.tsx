"use client";

import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  OakTertiaryButton,
  OakTertiaryInvertedButton,
  OakBox,
  OakMaxWidth,
  OakFlex,
  OakMediaClip,
  OakMediaClipList,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";
import { ActionsCamel } from "@oaknational/oak-curriculum-schema";

import VideoPlayer, {
  VideoEventCallbackArgs,
} from "@/components/SharedComponents/VideoPlayer";
import { resolveOakHref } from "@/common-lib/urls";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import MediaClipWithThumbnail from "@/components/TeacherComponents/LessonMediaClipWithThumbnail";
import {
  getLessonOverviewBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
  getLessonMediaBreadCrumb,
  sortMediaClipsByOrder,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonPathway } from "@/components/TeacherComponents/types/lesson.types";
import { LessonMediaClipInfo } from "@/components/TeacherComponents/LessonMediaClipInfo";
import { LessonMediaAttributions } from "@/components/TeacherComponents/LessonMediaAttributions/LessonMediaAttributions";
import type {
  MediaClip,
  MediaClipListCamelCase,
} from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import {
  getPlaybackId,
  getPlayingState,
  getInitialCurrentClip,
  joinTranscript,
  createLearningCycleVideosTitleMap,
} from "@/components/TeacherComponents/helpers/lessonMediaHelpers/lessonMedia.helpers";
import { RestrictedContentPrompt } from "@/components/TeacherComponents/RestrictedContentPrompt/RestrictedContentPrompt";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import { LEGACY_COHORT } from "@/config/cohort";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

type BaseLessonMedia = {
  lessonTitle: string;
  lessonSlug: string;
  keyStageTitle: string;
  loginRequired: boolean;
  geoRestricted: boolean;
  mediaClips: MediaClipListCamelCase;
  lessonOutline: { lessonOutline: string }[];
  lessonReleaseDate: string | null;
  actions?: ActionsCamel | null;
};

type CanonicalLesson = BaseLessonMedia & {
  pathways: LessonPathway[];
};

type NonCanonicalLesson = BaseLessonMedia & LessonPathway;

type LessonMediaCommonProps = {
  breadcrumbsSlot?: ReactNode;
};

type LessonMediaProps =
  | {
      isCanonical: true;
      lesson: CanonicalLesson;
    }
  | {
      isCanonical: false;
      lesson: NonCanonicalLesson;
    };

export const LessonMedia = (
  props: LessonMediaProps & LessonMediaCommonProps,
) => {
  const { isCanonical, lesson, breadcrumbsSlot } = props;
  const {
    lessonTitle,
    lessonSlug,
    keyStageTitle,
    mediaClips,
    lessonOutline,
    actions,
    lessonReleaseDate,
    loginRequired,
    geoRestricted,
  } = lesson;

  const { track } = useAnalytics();
  const { mediaClipsPlaylistPlayed } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );
  const {
    showSignedOutLoginRequired,
    showSignedOutGeoRestricted,
    showGeoBlocked,
    showSignedInNotOnboarded,
  } = useComplexCopyright({
    loginRequired,
    geoRestricted,
  });

  const showRestricted =
    showSignedOutLoginRequired ||
    showSignedOutGeoRestricted ||
    showSignedInNotOnboarded;

  const subjectSlug = isCanonical
    ? (lesson?.pathways[0]?.subjectSlug ?? "")
    : (lesson.subjectSlug ?? "");

  const commonPathway = getCommonPathway(
    props.isCanonical ? props.lesson.pathways : [props.lesson],
  );

  const {
    programmeSlug,
    unitSlug,
    subjectTitle,
    yearTitle,
    unitTitle,
    lessonCohort,
  } = commonPathway;

  const isLegacy = lessonCohort === LEGACY_COHORT;

  const searchParams = useSearchParams();
  const videoQueryParam = searchParams?.get("video") ?? null;

  // construct list of all clips in one array

  const isPEPractical = !!actions?.isPePractical;
  const isPELesson = !!actions?.displayPETitle;
  const isMFL = !!actions?.displayVocabButton;

  const learningCycleVideosTitleMap = createLearningCycleVideosTitleMap({
    isMFL,
    isPELesson,
    learningCycleVideos: mediaClips,
    lessonOutlines: lessonOutline,
  });

  const listOfAllClips = useMemo(() => {
    return mediaClips
      ? Object.keys(mediaClips)
          .map((learningCycle) => {
            return (
              mediaClips[learningCycle]
                ?.toSorted(sortMediaClipsByOrder)
                .map((mediaClip: MediaClip) => {
                  return {
                    ...mediaClip,
                    learningCycle,
                  };
                }) || []
            );
          })
          .flat()
      : [];
  }, [mediaClips]);

  const [currentClip, setCurrentClip] = useState(
    getInitialCurrentClip(listOfAllClips, videoQueryParam ?? undefined),
  );
  const [currentIndex, setCurrentIndex] = useState(
    currentClip ? listOfAllClips.indexOf(currentClip) : 0,
  );
  const [playedVideos, setPlayedVideos] = useState<string[]>([]);

  const videoPlayerWrapper = useRef<HTMLDivElement>(null);

  const goToTheNextClip = (mediaId: string) => {
    if (programmeSlug && unitSlug) {
      const newUrl = resolveOakHref({
        page: "lesson-media",
        programmeSlug,
        unitSlug,
        lessonSlug,
      });

      window.history.replaceState(
        window.history.state,
        "",
        `${newUrl}?video=${mediaId}`,
      );
    }
  };

  useEffect(() => {
    if (showGeoBlocked) {
      track.contentBlockNotificationDisplayed({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "explore",
        componentType: "lesson_media_clips",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        lessonName: lessonTitle ?? null,
        lessonSlug: lessonSlug ?? null,
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: lessonReleaseDate ?? null,
        unitName: unitTitle ?? null,
        unitSlug: unitSlug ?? null,
        contentType: "lesson",
        accessBlockType: "Geo-restriction",
        accessBlockDetails: {},
      });
    }
  }, [
    track,
    showGeoBlocked,
    lessonTitle,
    lessonSlug,
    lessonReleaseDate,
    unitTitle,
    unitSlug,
  ]);

  useEffect(() => {
    setCurrentClip(
      getInitialCurrentClip(listOfAllClips, videoQueryParam ?? undefined),
    );
  }, [listOfAllClips, videoQueryParam]);

  const handleVideoChange = (clip: MediaClip & { learningCycle: string }) => {
    goToTheNextClip(String(clip.mediaId));
    setCurrentClip(clip);
    setCurrentIndex(listOfAllClips.indexOf(clip));
  };

  const handleVideoEvents = (e: VideoEventCallbackArgs) => {
    if (e.event === "play") {
      currentClip &&
        setPlayedVideos([...playedVideos, String(currentClip.mediaId)]);
    }

    // we use this check rather than event === "end" because Mux sometimes dispatches "pause" event when video ends
    if (e.timeElapsed === e.duration) {
      const nextClip = listOfAllClips[currentIndex + 1];
      nextClip && handleVideoChange(nextClip);
    }
  };

  const onMediaClipClick = (clipSlug: string) => {
    const clickedMediaClip = listOfAllClips.find(
      (clip) => clip.mediaId === clipSlug,
    );
    clickedMediaClip && handleVideoChange(clickedMediaClip);
    videoPlayerWrapper.current?.focus();

    mediaClipsPlaylistPlayed({
      learningCycle: clickedMediaClip?.learningCycle ?? null,
      durationSeconds: clickedMediaClip?.videoObject?.duration ?? 0,
      isCaptioned: false,
      videoPlaybackId: [
        clickedMediaClip?.videoObject?.playbackIds[0]?.id ?? "",
      ],
      videoTitle:
        clickedMediaClip?.customTitle ??
        clickedMediaClip?.mediaObject?.displayName ??
        "",
      timeElapsedSeconds: 0,
      isMuted: false,
      mediaClipsCount: listOfAllClips.length,
      mediaClipIndex:
        Number.parseInt(clickedMediaClip?.order.toString() ?? "0") ?? 0,
    });
  };

  const videoPlayer = currentClip && (
    <VideoPlayer
      playbackId={getPlaybackId(currentClip) || ""}
      playbackPolicy={"signed"}
      title={currentClip.customTitle ?? currentClip?.mediaObject?.displayName}
      location={"media clips"}
      isLegacy={isLegacy}
      isAudioClip={currentClip.mediaObject?.format === "mp3"}
      userEventCallback={handleVideoEvents}
      loadingTextColor="text-inverted"
      defaultHiddenCaptions={isPEPractical}
      cloudinaryUrl={currentClip.mediaObject.url}
      muxAssetId={currentClip.videoObject?.muxAssetId}
      useTeacherBrowseTracking
    />
  );

  // media clip list component
  const mediaClipList = (
    <OakMediaClipList
      lessonTitle={lessonTitle}
      currentClipCounter={currentIndex + 1}
      totalClipCounter={listOfAllClips.length}
    >
      {listOfAllClips.map((mediaClip, index: number) => {
        const { videoObject, mediaId, mediaObject } = mediaClip;
        if (
          (mediaObject?.format === "mp4" || mediaObject?.format === "m4v") &&
          videoObject
        ) {
          const signedPlaybackId = videoObject?.playbackIds?.find(
            (playbackId) => {
              return playbackId?.policy === "signed";
            },
          );
          const title = mediaClip.customTitle
            ? mediaClip.customTitle
            : mediaClip.mediaObject?.displayName;
          return (
            <MediaClipWithThumbnail
              clipName={title}
              timeCode={videoObject.duration ?? 0}
              learningCycle={
                isPELesson
                  ? ""
                  : learningCycleVideosTitleMap[mediaClip.learningCycle]
              }
              muxPlayingState={getPlayingState(
                String(currentClip?.mediaId),
                String(mediaId),
                playedVideos,
              )}
              playbackId={signedPlaybackId?.id ?? ""}
              playbackPolicy={"signed"}
              isAudioClip={false}
              onClick={() => onMediaClipClick(String(mediaId))}
              key={`${title} ${index}`}
            />
          );
        } else if (mediaObject?.format === "mp3" && videoObject) {
          const title = mediaClip.customTitle
            ? mediaClip.customTitle
            : mediaClip.mediaObject.displayName;
          return (
            <OakMediaClip
              clipName={title}
              timeCode={videoObject.duration ?? 0}
              learningCycle={
                learningCycleVideosTitleMap[mediaClip.learningCycle]
              }
              muxPlayingState={getPlayingState(
                String(currentClip?.mediaId),
                String(mediaId),
                playedVideos,
              )}
              isAudioClip={true}
              imageAltText=""
              onClick={() => onMediaClipClick(String(mediaId))}
              key={`${title} ${index}`}
            />
          );
        }
      })}
    </OakMediaClipList>
  );

  // media clip info component
  const MediaClipInfo = ({ isMobile }: { isMobile: boolean }) => {
    return (
      currentClip &&
      subjectTitle && (
        <LessonMediaClipInfo
          clipTitle={
            currentClip.customTitle
              ? currentClip.customTitle
              : currentClip.mediaObject.displayName
          }
          keyStageTitle={keyStageTitle}
          yearTitle={yearTitle ?? ""}
          subjectTitle={subjectTitle}
          videoTranscript={joinTranscript(currentClip)}
          copyLinkButtonEnabled={true}
          isMobile={isMobile}
        />
      )
    );
  };

  const helpArticleLink = (
    <OakTertiaryInvertedButton
      element="a"
      href={"https://support.thenational.academy/video-and-audio-clips"}
      target="_blank"
      iconName="external"
      data-testid="help-article-link"
      isTrailingIcon
      aria-label="Read help article for this page (opens in a new tab)"
    >
      Read help article for this page
    </OakTertiaryInvertedButton>
  );

  return (
    <OakMaxWidth $pb={"spacing-80"} $ph={"spacing-12"}>
      <OakBox $mb={"spacing-32"} $mt={"spacing-24"} data-testid="media-view">
        {breadcrumbsSlot ??
          (isCanonical ? null : (
            <Breadcrumbs
              breadcrumbs={[
                ...getBreadcrumbsForLessonPathway(commonPathway),
                getLessonOverviewBreadCrumb({
                  lessonTitle,
                  lessonSlug,
                  programmeSlug,
                  unitSlug,
                  isCanonical,
                }),
                getLessonMediaBreadCrumb({
                  lessonSlug,
                  programmeSlug,
                  unitSlug,
                  subjectSlug,
                  disabled: true,
                }),
              ]}
            />
          ))}
      </OakBox>
      <OakBox $mb={"spacing-24"}>
        {programmeSlug && unitSlug && !isCanonical && (
          <OakTertiaryButton
            element="a"
            href={resolveOakHref({
              page: "lesson-overview",
              programmeSlug,
              lessonSlug,
              unitSlug,
            })}
            iconName="arrow-left"
            data-testid="back-to-lesson-button"
          >
            Back to lesson
          </OakTertiaryButton>
        )}
        {isCanonical && (
          <OakTertiaryButton
            element="a"
            href={resolveOakHref({
              page: "lesson-overview-canonical",
              lessonSlug,
            })}
            iconName="arrow-left"
            data-testid="back-to-lesson-button"
          >
            Back to lesson
          </OakTertiaryButton>
        )}
      </OakBox>
      {showRestricted || showGeoBlocked ? (
        <RestrictedContentPrompt
          showGeoBlocked={showGeoBlocked}
          programmeSlug={programmeSlug}
          lessonSlug={lessonSlug}
          unitSlug={unitSlug}
          isCanonical={isCanonical}
        />
      ) : (
        <>
          {listOfAllClips.length > 0 && currentClip && (
            <OakBox data-testid="media-clip-wrapper">
              <OakFlex
                $flexDirection={["column", "column", "row"]}
                $gap={["spacing-24", "spacing-24", "spacing-0"]}
                $mb={"spacing-24"}
                $height={["auto", "auto", "spacing-480"]}
              >
                <OakFlex
                  $width={["100%", "100%", "spacing-960"]}
                  $alignItems={"center"}
                  $background={"bg-inverted"}
                  $overflow={["visible", "visible", "hidden"]}
                  $height={"100%"}
                  $br={"border-solid-m"}
                  data-testid="video-player-wrapper"
                  ref={videoPlayerWrapper}
                  tabIndex={-1}
                >
                  {videoPlayer}
                </OakFlex>
                <OakBox $display={["block", "block", "none"]} $width={"100%"}>
                  <MediaClipInfo isMobile />
                </OakBox>
                <OakBox
                  $width={["auto", "auto", "spacing-480"]}
                  $minWidth={["auto", "auto", "spacing-480"]}
                >
                  {mediaClipList}
                </OakBox>
              </OakFlex>
              <OakBox $display={["none", "none", "block"]} $pb="spacing-48">
                <OakGrid>
                  <OakGridArea $colSpan={8}>
                    <MediaClipInfo isMobile={false} />
                  </OakGridArea>
                  <OakGridArea $colSpan={4} $alignItems={"flex-end"}>
                    {helpArticleLink}
                  </OakGridArea>
                </OakGrid>
              </OakBox>
              <OakBox $display={["block", "block", "none"]}>
                {helpArticleLink}
              </OakBox>
              <LessonMediaAttributions
                mediaClipsWithAttributions={
                  listOfAllClips
                    .map((clip) => {
                      const attribution =
                        clip.mediaObject?.metadata?.attribution;
                      return attribution
                        ? { name: clip.mediaObject.displayName, attribution }
                        : null;
                    })
                    .filter(Boolean) as Array<{
                    name: string;
                    attribution: string;
                  }>
                }
              />
            </OakBox>
          )}
        </>
      )}
    </OakMaxWidth>
  );
};
