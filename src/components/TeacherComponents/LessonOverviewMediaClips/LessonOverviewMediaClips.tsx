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
  lessonOutline: { lessonOutline: string }[] | null;
  isCanonical?: boolean;
};

const LessonOverviewMediaClips: FC<LessonOverviewMediaClipsProps> = ({
  learningCycleVideos,
  unitSlug,
  programmeSlug,
  lessonSlug,
  lessonOutline,
  isCanonical,
}) => {
  if (!learningCycleVideos) return null;

  const videosArray = Object.values(learningCycleVideos);
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
      {videosArray.map((video, index) => {
        const firstCycleVideo = video[0];
        if (!firstCycleVideo) return null;

        const isAudioClip = firstCycleVideo.mediaObject?.format === "mp3";

        return (
          <OakGridArea
            key={index}
            $colSpan={[0]}
            $maxWidth={["100%", "100%", "all-spacing-18"]}
          >
            <LessonOverviewClipWithThumbnail
              title={
                lessonOutline ? (lessonOutline[index]?.lessonOutline ?? "") : ""
              }
              playbackId={
                isAudioClip
                  ? (firstCycleVideo.videoObject?.muxPlaybackId ?? "")
                  : (firstCycleVideo.videoObject?.playbackIds?.[1]?.id ?? "")
              }
              playbackPolicy={"signed"}
              numberOfClips={video.length}
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
      })}
    </OakGrid>
  );
};

export default LessonOverviewMediaClips;
