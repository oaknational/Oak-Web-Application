import { useState, useRef } from "react";
import { useRouter } from "next/router";
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
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonPathway } from "@/components/TeacherComponents/types/lesson.types";
import { LessonMediaClipInfo } from "@/components/TeacherComponents/LessonMediaClipInfo";
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
import { Actions } from "@/node-lib/curriculum-api-2023/shared.schema";

type BaseLessonMedia = {
  lessonTitle: string;
  lessonSlug: string;
  keyStageTitle: string;
  mediaClips: MediaClipListCamelCase;
  lessonOutline: { lessonOutline: string }[];
  actions?: Actions;
};

type CanonicalLesson = BaseLessonMedia & {
  pathways: LessonPathway[];
};

type NonCanonicalLesson = BaseLessonMedia & LessonPathway;

type LessonMediaProps =
  | {
      isCanonical: true;
      lesson: CanonicalLesson;
    }
  | {
      isCanonical: false;
      lesson: NonCanonicalLesson;
    };

export const LessonMedia = (props: LessonMediaProps) => {
  const { isCanonical, lesson } = props;
  const {
    lessonTitle,
    lessonSlug,
    keyStageTitle,
    mediaClips,
    lessonOutline,
    actions,
  } = lesson;
  const subjectSlug = isCanonical
    ? (lesson?.pathways[0]?.subjectSlug ?? "")
    : (lesson.subjectSlug ?? "");

  const commonPathway = getCommonPathway(
    props.isCanonical ? props.lesson.pathways : [props.lesson],
  );

  const { programmeSlug, unitSlug, subjectTitle, yearTitle } = commonPathway;

  const router = useRouter();
  const { query } = router;

  // construct list of all clips in one array

  const isPELesson = actions?.displayPETitle;
  const isMFL = actions?.displayVocabButton;

  const learningCycleVideosTitleMap = createLearningCycleVideosTitleMap({
    isMFL,
    isPELesson,
    learningCycleVideos: mediaClips,
    lessonOutlines: lessonOutline,
  });

  const listOfAllClips = mediaClips
    ? Object.keys(mediaClips)
        .map((learningCycle) => {
          return (
            mediaClips[learningCycle]?.map((mediaClip: MediaClip) => {
              return {
                ...mediaClip,
                learningCycle,
              };
            }) || []
          );
        })
        .flat()
    : [];

  const [currentClip, setCurrentClip] = useState(
    getInitialCurrentClip(listOfAllClips, query.video),
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

  const handleVideoChange = (clip: MediaClip & { learningCycle: string }) => {
    goToTheNextClip(String(clip.mediaId));
    setCurrentClip(clip);
    setCurrentIndex(listOfAllClips.indexOf(clip));
  };

  const onMediaClipClick = (clipSlug: string) => {
    const clickedMediaClip = listOfAllClips.find(
      (clip) => clip.mediaId === clipSlug,
    );
    clickedMediaClip && handleVideoChange(clickedMediaClip);
    videoPlayerWrapper.current?.focus();
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

  const videoPlayer = currentClip && (
    <VideoPlayer
      playbackId={getPlaybackId(currentClip) || ""}
      playbackPolicy={"signed"}
      title={currentClip.customTitle ?? currentClip?.mediaObject?.displayName}
      // avo events need updating
      location={"lesson"}
      isLegacy={false}
      isAudioClip={currentClip.mediaObject?.format === "mp3"}
      userEventCallback={handleVideoEvents}
      loadingTextColor="white"
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
        if (mediaObject?.format === "mp4" && videoObject) {
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
              isAudioClip={false}
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
  const lessonMediaClipInfo = currentClip && subjectTitle && (
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
    />
  );

  const helpArticleLink = (
    <OakTertiaryInvertedButton
      element="a"
      href={"https://support.thenational.academy/video-and-audio-clips"}
      target="_blank"
      iconName="external"
      data-testid="help-article-link"
      isTrailingIcon
    >
      Read help article for this page
    </OakTertiaryInvertedButton>
  );

  return (
    <OakMaxWidth $pb={"inner-padding-xl8"} $ph={"inner-padding-s"}>
      <OakBox
        $mb={"space-between-m2"}
        $mt={"space-between-m"}
        data-testid="media-view"
      >
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
      </OakBox>
      <OakBox $mb={"space-between-m"}>
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

      {listOfAllClips.length > 0 && currentClip && (
        <OakBox data-testid="media-clip-wrapper">
          <OakFlex
            $flexDirection={["column", "column", "row"]}
            $gap={["space-between-m", "space-between-m", "space-between-none"]}
            $mb={"space-between-m"}
            $height={["auto", "auto", "all-spacing-21"]}
          >
            <OakFlex
              $width={["100%", "100%", "all-spacing-23"]}
              $alignItems={"center"}
              $background={"black"}
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
              {lessonMediaClipInfo}
            </OakBox>
            <OakBox
              $width={["auto", "auto", "all-spacing-21"]}
              $minWidth={["auto", "auto", "all-spacing-21"]}
            >
              {mediaClipList}
            </OakBox>
          </OakFlex>
          <OakBox $display={["none", "none", "block"]}>
            <OakGrid>
              <OakGridArea $colSpan={8}>{lessonMediaClipInfo}</OakGridArea>
              <OakGridArea $colSpan={4} $alignItems={"flex-end"}>
                {helpArticleLink}
              </OakGridArea>
            </OakGrid>
          </OakBox>
          <OakBox $display={["block", "block", "none"]}>
            {helpArticleLink}
          </OakBox>
        </OakBox>
      )}
    </OakMaxWidth>
  );
};
