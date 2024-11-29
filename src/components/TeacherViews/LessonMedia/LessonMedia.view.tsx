import {
  OakTertiaryButton,
  OakBox,
  OakMaxWidth,
  OakFlex,
  OakMediaClip,
  OakMediaClipList,
} from "@oaknational/oak-components";
import { useState } from "react";
import { useRouter } from "next/router";

import VideoPlayer, {
  VideoEventCallbackArgs,
} from "@/components/SharedComponents/VideoPlayer";
import { resolveOakHref } from "@/common-lib/urls";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
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
} from "@/components/TeacherComponents/types/mediaClip.types";
import { useSignedThumbnailToken } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";
import {
  getTranscript,
  getPlaybackId,
  getPlayingState,
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

  // construct list of all clips in one array
  const listOfAllClips = Object.keys(mediaClips)
    .map((learningCycle) =>
      mediaClips[learningCycle as LearningCycle].map(
        (mediaClip: MediaClip) => mediaClip,
      ),
    )
    .flat();

  // get current clip from url parameters and if not available then choose first clip from the list
  const getInitialCurrentClip = () => {
    const videoQueryFromUrl = query.video;
    if (videoQueryFromUrl) {
      return listOfAllClips.find((clip) => clip.slug === videoQueryFromUrl);
    } else {
      return listOfAllClips[0];
    }
  };

  const [currentClip, setCurrentClip] = useState(getInitialCurrentClip());
  const [currentIndex, setCurrentIndex] = useState(
    currentClip ? listOfAllClips.indexOf(currentClip) : 0,
  );

  const [playedVideosList, setPlayedVideosList] = useState<string[]>([]);

  // action performed on media clip item click
  const onMediaClipClick = (clipSlug: string) => {
    const clickedMediaClip = listOfAllClips.find(
      (clip) => clip.slug === clipSlug,
    );
    setCurrentClip(clickedMediaClip);
    setCurrentIndex(
      clickedMediaClip ? listOfAllClips.indexOf(clickedMediaClip) : 0,
    );

    // add video parameter to the url
    query.video = clipSlug;
    router.replace(router);

    // router.replace(
    //   {
    //     pathname: router.pathname,
    //     query: {
    //       programmeSlug: programmeSlug,
    //       unitSlug: unitSlug,
    //       lessonSlug: lessonSlug,
    //       video: clipSlug,
    //     },
    //   },
    //   undefined,
    //   { shallow: true },
    // );
  };

  const handleVideoPlayed = (event: VideoEventCallbackArgs) => {
    if (event.event === "play") {
      if (currentClip && !playedVideosList.includes(currentClip?.slug)) {
        setPlayedVideosList((playedVideosList) => [
          ...playedVideosList,
          currentClip.slug,
        ]);
      }
    }
  };

  console.log("played videos: ", playedVideosList);

  const videoPlayer = currentClip && (
    <VideoPlayer
      playbackId={getPlaybackId(currentClip)}
      playbackPolicy={"signed"}
      title={currentClip.mediaClipTitle}
      location={"lesson"}
      isLegacy={false}
      userEventCallback={handleVideoPlayed}
    />
  );

  // media clip list component
  const mediaClipList = (
    <OakMediaClipList
      lessonTitle={lessonTitle}
      currentClipCounter={currentIndex + 1}
      totalClipCounter={listOfAllClips.length}
    >
      {listOfAllClips.map((mediaClip: MediaClip) => {
        const {
          videoObject,
          mediaObject,
          mediaClipTitle,
          learningCycleTitle,
          slug,
          mediaType,
        } = mediaClip;

        if (mediaType === "video" && videoObject) {
          const thumbnailToken = useSignedThumbnailToken({
            playbackId: videoObject?.muxPlaybackId,
            playbackPolicy: videoObject?.playbackPolicy,
            isLegacy: false,
          });

          const thumbnailImage = thumbnailToken
            ? `https://image.mux.com/${videoObject.muxPlaybackId}/thumbnail.png?token=${thumbnailToken.playbackToken}`
            : "";

          return (
            <OakMediaClip
              clipName={mediaClipTitle}
              timeCode={videoObject.duration}
              learningCycle={learningCycleTitle}
              thumbnailImage={thumbnailImage}
              muxPlayingState={getPlayingState(
                currentClip?.slug,
                slug,
                playedVideosList,
              )}
              isAudioClip={false}
              imageAltText=""
              onClick={() => onMediaClipClick(slug)}
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
        <OakBox>
          <OakFlex
            $flexDirection={["column", "column", "row"]}
            $gap={["space-between-m", "space-between-m", "space-between-none"]}
            $mb={"space-between-m"}
          >
            <OakFlex
              $width={["100%", "100%", "all-spacing-23"]}
              $alignItems={"center"}
              $overflow={["visible", "visible", "hidden"]}
            >
              {videoPlayer}
            </OakFlex>
            <OakBox $display={["block", "block", "none"]}>
              {lessonMediaClipInfo}
            </OakBox>
            {mediaClipList}
          </OakFlex>
          <OakBox $display={["none", "none", "block"]}>
            {lessonMediaClipInfo}
          </OakBox>
        </OakBox>
      )}
    </OakMaxWidth>
  );
};
