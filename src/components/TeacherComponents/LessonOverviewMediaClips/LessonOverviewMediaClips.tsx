import React, { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import LessonOverviewClipWithThumbnail from "./LessonOverviewClipWithThumbnail";

import { MediaClipsList } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { resolveOakHref } from "@/common-lib/urls";

type LessonOverviewMediaClipsProps = {
  learningCycleVideos: MediaClipsList;
  unitSlug: string | null;
  programmeSlug: string | null;
  lessonSlug: string;
};

const LessonOverviewMediaClips: FC<LessonOverviewMediaClipsProps> = ({
  learningCycleVideos,
  unitSlug,
  programmeSlug,
  lessonSlug,
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
              title={firstCycleVideo.mediaClipTitle}
              playbackId={
                firstCycleVideo.videoObject
                  ? firstCycleVideo.videoObject.muxPlaybackId
                  : ""
              }
              playbackPolicy={
                firstCycleVideo.videoObject
                  ? (firstCycleVideo.videoObject.playbackPolicy as
                      | "public"
                      | "signed")
                  : "public"
              }
              numberOfClips={video.length}
              href={
                programmeSlug && unitSlug
                  ? resolveOakHref({
                      page: "lesson-media",
                      lessonSlug: lessonSlug,
                      programmeSlug,
                      unitSlug,
                      query: { video: firstCycleVideo.slug },
                    })
                  : resolveOakHref({
                      page: "lesson-media-canonical",
                      lessonSlug: lessonSlug,
                      query: { video: firstCycleVideo.slug },
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
