import React, { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import LessonOverviewClipWithThumbnail from "./LessonOverviewClipWithThumbnail";

import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { resolveOakHref } from "@/common-lib/urls";

type LessonOverviewMediaClipsProps = {
  learningCycleVideos: MediaClipListCamelCase | null;
  unitSlug: string | null;
  programmeSlug: string | null;
  lessonSlug: string;
  isCanonical?: boolean;
  lessonOutline: { lessonOutline: string }[] | null;
  isPELesson: boolean;
  isMFL: boolean;
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
}) => {
  const createLearningCycleVideosTitleMap = () => {
    const learningCyclesArray = learningCycleVideos
      ? Object.keys(learningCycleVideos)
      : [];

    const learningCycleVideosTitleMap: { [key: string]: string | undefined } =
      {};

    learningCyclesArray.forEach((learningCycle) => {
      // if it is PE lesson, then the first video of each learning cycle is the title
      // if there is a customTitle on the video it takes priorirty
      if (isPELesson && learningCycle) {
        const firstVideo = learningCycleVideos?.[learningCycle]?.[0];
        learningCycleVideosTitleMap[learningCycle] =
          firstVideo?.customTitle ?? firstVideo?.mediaObject?.displayName;
        // for the rest of subjects we hardcode the title for 'intro' learning cycle because there is no lesson outline for it
        // intro is called 'Keywords' for MFL and 'Intro' for the rest of the subjects
      } else if (learningCycle === "intro") {
        learningCycleVideosTitleMap[learningCycle] = isMFL
          ? "Keywords"
          : "Intro";
        // for the remaining learning cycles we use the lesson outline as the title
      } else {
        // the last letter of learning cycle is the number of the learning cycle
        const learningCycleNumber: number = Number(learningCycle.slice(-1));
        // lessonOutlineIndex is the learning cycle number - 1 because it is 0 indexed
        const lessonOutlineIndex = learningCycleNumber - 1;
        learningCycleVideosTitleMap[learningCycle] =
          lessonOutline?.[lessonOutlineIndex]?.lessonOutline;
      }
    });

    return learningCycleVideosTitleMap;
  };

  const learningCycleVideosTitleMap = createLearningCycleVideosTitleMap();

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

          const firstCycleVideo = learningCycleVideos[0];
          if (!firstCycleVideo) return null;

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
              />
            </OakGridArea>
          );
        },
      )}
    </OakGrid>
  );
};

export default LessonOverviewMediaClips;
