import React, { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import LessonOverviewClipWithThumbnail from "./LessonOverviewClipWithThumbnail";

import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { resolveOakHref } from "@/common-lib/urls";
import { createLearningCycleVideosTitleMap } from "@/components/TeacherComponents/helpers/lessonMediaHelpers/lessonMedia.helpers";
import { MediaClipsButtonNameValueType } from "@/browser-lib/avo/Avo";

export type TrackingCallbackProps = {
  mediaClipsButtonName: MediaClipsButtonNameValueType;
  learningCycle?: string;
};

type LessonOverviewMediaClipsProps = {
  learningCycleVideos: MediaClipListCamelCase | null;
  unitSlug: string | null;
  programmeSlug: string | null;
  lessonSlug: string;
  isCanonical?: boolean;
  lessonOutline: { lessonOutline: string }[] | null;
  isPELesson: boolean;
  isMFL: boolean;
  onTrackingCallback?: (props: TrackingCallbackProps) => void;
};
const LessonOverviewMediaClips: FC<LessonOverviewMediaClipsProps> = ({
  learningCycleVideos,
  unitSlug,
  programmeSlug,
  lessonSlug,
  isCanonical,
  lessonOutline,
  isPELesson,
  isMFL,
  onTrackingCallback,
}) => {
  const learningCycleVideosTitleMap = createLearningCycleVideosTitleMap({
    isMFL,
    isPELesson,
    learningCycleVideos,
    lessonOutlines: lessonOutline,
  });

  if (!learningCycleVideos) return null;

  return (
    <OakGrid
      $width={"100%"}
      $gridTemplateColumns={[
        "repeat(1, 1fr)",
        "repeat(1, 1fr)",
        "repeat(4, 1fr)",
      ]}
      $rg={"all-spacing-4"}
    >
      {Object.entries(learningCycleVideos).map(
        ([learningCycleTitle, learningCycleVideos]) => {
          const learningCycleTitleToDisplay =
            learningCycleVideosTitleMap[learningCycleTitle];

          const firstCycleVideo = learningCycleVideos.find(
            (video) => video.order.toString() === "1",
          );
          if (!firstCycleVideo || !firstCycleVideo.videoObject) return null;

          const isAudioClip = firstCycleVideo.mediaObject?.format === "mp3";
          const signedPlaybackId = firstCycleVideo.videoObject.playbackIds.find(
            (playbackId) => {
              return playbackId.policy === "signed";
            },
          );
          if (!signedPlaybackId) return null;

          return (
            <OakGridArea
              key={learningCycleTitle}
              $colSpan={[0]}
              $maxWidth={["100%", "100%", "all-spacing-18"]}
            >
              <LessonOverviewClipWithThumbnail
                title={learningCycleTitleToDisplay ?? ""}
                playbackId={
                  isAudioClip
                    ? firstCycleVideo.videoObject.muxAssetId
                    : signedPlaybackId.id
                }
                isAudioClip={isAudioClip}
                playbackPolicy={"signed"}
                numberOfClips={learningCycleVideos.length}
                rel="nofollow"
                href={
                  !isCanonical && programmeSlug && unitSlug
                    ? resolveOakHref({
                        page: "lesson-media",
                        lessonSlug: lessonSlug,
                        programmeSlug,
                        unitSlug,
                        query: { video: String(firstCycleVideo.mediaId) },
                      })
                    : resolveOakHref({
                        page: "lesson-media-canonical",
                        lessonSlug: lessonSlug,
                        query: { video: String(firstCycleVideo.mediaId) },
                      })
                }
                onClick={() => {
                  if (onTrackingCallback) {
                    onTrackingCallback({
                      mediaClipsButtonName: "select clip",
                      learningCycle: learningCycleTitle,
                    });
                  }
                }}
              />
            </OakGridArea>
          );
        },
      )}
    </OakGrid>
  );
};

export default LessonOverviewMediaClips;
