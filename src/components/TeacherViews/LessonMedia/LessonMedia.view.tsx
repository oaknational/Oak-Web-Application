import {
  OakTertiaryButton,
  OakBox,
  OakMaxWidth,
  OakFlex,
  OakMediaClipList,
} from "@oaknational/oak-components";
import { useState } from "react";

import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
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
  ConstructedMediaClip,
} from "@/components/TeacherComponents/types/mediaClip.types";
import { constructMediaClipList } from "@/components/TeacherComponents/helpers/lessonHelpers/mediaClips.helpers";
import { useSignedThumbnailToken } from "@/components/SharedComponents/VideoPlayer/useSignedVideoToken";

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

export function LessonMedia(props: LessonMediaProps) {
  const { isCanonical, lesson } = props;
  const { lessonTitle, lessonSlug, keyStageTitle, mediaClips } = lesson;

  const commonPathway = getCommonPathway(
    props.isCanonical ? props.lesson.pathways : [props.lesson],
  );

  const { programmeSlug, unitSlug, subjectTitle, yearTitle } = commonPathway;



  const listOfAllClips: ConstructedMediaClip[] = [];

  Object.keys(mediaClips).forEach((learningCycle) => {
    mediaClips[learningCycle].forEach((mediaClip: MediaClip) => {
      let item: ConstructedMediaClip | {};

      if (mediaClip.mediaType === "video") {
        const { videoObject, mediaClipTitle, learningCycleTitle, mediaClipSlug } = mediaClip;

        const thumbnailToken = videoObject && useSignedThumbnailToken({
          playbackId: videoObject?.muxPlaybackId,
          playbackPolicy: "signed",
          isLegacy: true,
        });

        item = {
          thumbnailImage: `https://image.mux.com/${videoObject.muxPlaybackId}/thumbnail.png?token=${thumbnailToken.playbackToken}`,
          muxPlaybackId: videoObject?.muxPlaybackId || "",
          transcript: videoObject?.transcriptionSentences,
          timeCode: videoObject?.duration,
          clipName: mediaClipTitle,
          clipSlug: mediaClipSlug,
          learningCycle: learningCycleTitle,
          muxPlayingState: "standard",
          isAudioClip: false,
          element: "button",
        };
      } else {
        const { mediaObject, mediaClipTitle, learningCycleTitle, mediaClipSlug } = mediaClip;
        
          item = {
            muxPlaybackId: mediaObject?.muxPlaybackId,
            timeCode: mediaObject?.duration,
            clipName: mediaClipTitle,
            clipSlug: mediaClipSlug,
            learningCycle: learningCycleTitle,
            muxPlayingState: "standard",
            onClick: () => {},
            isAudioClip: true,
            element: "button",
          };
      } 

      if (item) listOfAllClips.push(item);
    });  
  });

  const [currentClip] = useState(listOfAllClips[0]);


  const videoPlayer = currentClip && (
    <VideoPlayer
      playbackId={"2AcJzv00T02KcjUgA2wR02KlVQcfSSJRgLkV286rVPeGqU"}
      playbackPolicy={"signed"}
      title={currentClip.clipName}
      location={"lesson"}
      isLegacy={true}
    />
  );

  // media clip list component
  const mediaClipList = (
    <OakMediaClipList
      lessonTitle={lessonTitle}
      mediaClipList={listOfAllClips}
    />
  );

  // media clip info component
  const lessonMediaClipInfo = currentClip && yearTitle && subjectTitle && (
    <LessonMediaClipInfo
      clipTitle={currentClip.clipName}
      keyStageTitle={keyStageTitle}
      yearTitle={yearTitle}
      subjectTitle={subjectTitle}
      videoTranscript={currentClip.transcript.join(" ")}
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

      {/* desktop layout */}
      {listOfAllClips.length > 0 && (
        <OakBox $display={["none", "none", "block"]}>
          <OakFlex
            $flexDirection={"row"}
            $height={"all-spacing-21"}
            $mb={"space-between-m"}
          >
            <OakFlex
              $flexGrow={1}
              $alignItems={"center"}
              $background={"black"}
              $overflow={"hidden"}
            >
              {videoPlayer}
            </OakFlex>
            <OakFlex $maxWidth={"all-spacing-20"}>{mediaClipList}</OakFlex>
          </OakFlex>

          {lessonMediaClipInfo}
        </OakBox>
      )}

      {/* mobile layout */}
      {listOfAllClips.length > 0 && (
        <OakBox $display={["block", "block", "none"]}>
          <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
            {videoPlayer}
            {lessonMediaClipInfo}
            {mediaClipList}
          </OakFlex>
        </OakBox>
      )}
    </OakMaxWidth>
  );
}
