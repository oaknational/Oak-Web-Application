import React, { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import LessonOverviewClipWithThumbnail from "./LessonOverviewClipWithThumbnail";

import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { resolveOakHref } from "@/common-lib/urls";

type LessonOverviewMediaClipsProps = {
  learningCycleVideos: MediaClipListCamelCase;
  unitSlug: string | null;
  programmeSlug: string | null;
  lessonSlug: string;
  lessonOutline: { lessonOutline: string }[] | null;
};

const LessonOverviewMediaClips: FC<LessonOverviewMediaClipsProps> = ({
  learningCycleVideos,
  unitSlug,
  programmeSlug,
  lessonSlug,
  lessonOutline,
}) => {
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
        return (
          <OakGridArea
            key={index}
            $colSpan={[0]}
            $maxWidth={["100%", "100%", "all-spacing-18"]}
          >
            <LessonOverviewClipWithThumbnail
              title={
                index === 0
                  ? "Intro"
                  : lessonOutline
                    ? (lessonOutline[index - 1]?.lessonOutline ?? "")
                    : ""
              }
              playbackId={firstCycleVideo.videoObject?.muxPlaybackId}
              // defaulted to signed cause they have both
              playbackPolicy={"signed"}
              numberOfClips={video.length}
              // how do these videos know which to play
              href={
                programmeSlug && unitSlug
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
