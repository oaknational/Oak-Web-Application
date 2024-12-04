import { useState } from "react";
import { useRouter } from "next/router";
import {
  OakTertiaryButton,
  OakBox,
  OakMaxWidth,
  OakFlex,
  OakMediaClip,
  OakMediaClipList,
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
  MediaClipsList,
  LearningCycle,
} from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import {
  getTranscript,
  getPlaybackId,
  getPlayingState,
  getInitialCurrentClip,
} from "@/components/TeacherComponents/helpers/lessonMediaHelpers/lessonMedia.helpers";

type BaseLessonMedia = {
  lessonTitle: string;
  lessonSlug: string;
  keyStageTitle: string;
  mediaClips: MediaClipsList;
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
  const { lessonTitle, lessonSlug, keyStageTitle, mediaClips } = lesson;

  const commonPathway = getCommonPathway(
    props.isCanonical ? props.lesson.pathways : [props.lesson],
  );

  const { programmeSlug, unitSlug, subjectTitle, yearTitle } = commonPathway;

  const router = useRouter();
  const { query } = router;
  const videoQuery = query.video;

  // construct list of all clips in one array
  const listOfAllClips = Object.keys(mediaClips)
    .map((learningCycle) =>
      mediaClips[learningCycle as LearningCycle].map(
        (mediaClip: MediaClip) => mediaClip,
      ),
    )
    .flat();

  const [currentClip, setCurrentClip] = useState(
    getInitialCurrentClip(listOfAllClips, videoQuery),
  );
  const [currentIndex, setCurrentIndex] = useState(
    currentClip ? listOfAllClips.indexOf(currentClip) : 0,
  );

  const playedVideosList: string[] =
    sessionStorage.getItem("playedVideosList")?.split(",") || [];

  const goToTheNextClip = (slug: string) =>
    router.replace(
      {
        pathname: router.pathname,
        query: {
          programmeSlug: programmeSlug,
          unitSlug: unitSlug,
          lessonSlug: lessonSlug,
          video: slug,
        },
      },
      undefined,
      { shallow: true },
    );

  // action performed on media clip item click
  const onMediaClipClick = (clipSlug: string) => {
    const clickedMediaClip = listOfAllClips.find(
      (clip) => clip.slug === clipSlug,
    );

    setCurrentClip(clickedMediaClip);
    setCurrentIndex(
      clickedMediaClip ? listOfAllClips.indexOf(clickedMediaClip) : 0,
    );
    goToTheNextClip(clipSlug);
  };

  const handlePlayedVideo = (event: VideoEventCallbackArgs) => {
    if (event.event === "play") {
      if (currentClip && !playedVideosList.includes(currentClip?.slug)) {
        // add played video to session storage
        const updatedPlayedVideosList = [
          ...playedVideosList,
          currentClip.slug,
        ].toString();
        sessionStorage.setItem("playedVideosList", updatedPlayedVideosList);
      }
    } else if (event.event === "end") {
      const nextClip = listOfAllClips[currentIndex + 1];

      if (nextClip) {
        goToTheNextClip(nextClip.slug);
      }
    }
  };

  const videoPlayer = currentClip && (
    <VideoPlayer
      playbackId={getPlaybackId(currentClip)}
      playbackPolicy={"signed"}
      title={currentClip.mediaClipTitle}
      location={"lesson"}
      isLegacy={false}
      userEventCallback={handlePlayedVideo}
    />
  );

  // media clip list component
  const mediaClipList = (
    <OakMediaClipList
      lessonTitle={lessonTitle}
      currentClipCounter={currentIndex + 1}
      totalClipCounter={listOfAllClips.length}
    >
      {listOfAllClips.map((mediaClip: MediaClip, index: number) => {
        const {
          videoObject,
          mediaObject,
          mediaClipTitle,
          learningCycleTitle,
          slug,
          mediaType,
        } = mediaClip;

        if (mediaType === "video" && videoObject) {
          return (
            <MediaClipWithThumbnail
              clipName={mediaClipTitle}
              timeCode={videoObject.duration}
              learningCycle={learningCycleTitle}
              muxPlayingState={getPlayingState(
                currentClip?.slug,
                slug,
                playedVideosList,
              )}
              playbackId={mediaClip?.videoObject?.muxPlaybackId || ""}
              playbackPolicy={
                mediaClip?.videoObject?.playbackPolicy || "public"
              }
              isAudioClip={false}
              onClick={() => onMediaClipClick(slug)}
              key={index}
            />
          );
        } else if (mediaType === "audio" && mediaObject) {
          const { mediaClipTitle, learningCycleTitle, slug } = mediaClip;

          return (
            <OakMediaClip
              clipName={mediaClipTitle}
              timeCode={mediaObject.duration}
              learningCycle={learningCycleTitle}
              muxPlayingState={getPlayingState(
                currentClip?.slug,
                slug,
                playedVideosList,
              )}
              isAudioClip={false}
              imageAltText=""
              onClick={() => onMediaClipClick(slug)}
              key={index}
            />
          );
        }
      })}
    </OakMediaClipList>
  );

  // media clip info component
  const lessonMediaClipInfo = currentClip && yearTitle && subjectTitle && (
    <LessonMediaClipInfo
      clipTitle={currentClip.mediaClipTitle}
      keyStageTitle={keyStageTitle}
      yearTitle={yearTitle}
      subjectTitle={subjectTitle}
      videoTranscript={getTranscript(currentClip)}
      copyLinkButtonEnabled={true}
    />
  );

  return (
    <OakMaxWidth $pb={"inner-padding-xl8"} $ph={"inner-padding-s"}>
      <OakBox $mb={"space-between-m2"} $mt={"space-between-m"}>
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
              disabled: true,
            }),
          ]}
        />
      </OakBox>
      <OakBox $mb={"space-between-m"}>
        {programmeSlug && unitSlug && (
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
            >
              {videoPlayer}
            </OakFlex>
            <OakBox $display={["block", "block", "none"]} $width={"100%"}>
              {lessonMediaClipInfo}
            </OakBox>
            <OakBox $width={["auto", "auto", "all-spacing-21"]}>
              {mediaClipList}
            </OakBox>
          </OakFlex>
          <OakBox $display={["none", "none", "block"]}>
            {lessonMediaClipInfo}
          </OakBox>
        </OakBox>
      )}
    </OakMaxWidth>
  );
};
