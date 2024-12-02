import React, { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import LessonMediaClipWithThumbnail from "./LessonMediaClipWithThumbnail";

import { MediaObject } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { resolveOakHref } from "@/common-lib/urls";

type LessonOverviewMediaClipsProps = {
  learningCycleVideos: MediaObject;
  unitSlug: string | null;
  programmeSlug: string | null;
};

// TODO : Remove ternary statements from component

const LessonOverviewMediaClips: FC<LessonOverviewMediaClipsProps> = ({
  learningCycleVideos,
  unitSlug,
  programmeSlug,
}) => {
  // TODO: Add ticket to refactor so that this comes from the Database?
  const videosArray = Object.values(learningCycleVideos);
  // TODO : Add ticket to refactor media clips component ot break in phone design at media viewport
  return (
    <OakGrid
      $width={"100%"}
      $gridTemplateColumns={["repeat(1, 1fr)", "repeat(4, 1fr)"]}
      $rg={"all-spacing-4"}
    >
      {videosArray.map((video, index) => {
        return (
          <OakGridArea
            key={index}
            $colSpan={[0]}
            $maxWidth={["100%", "all-spacing-18"]}
          >
            <LessonMediaClipWithThumbnail
              title={video[0]?.mediaClipTitle ? video[0]?.mediaClipTitle : ""}
              playbackId={
                video[0]?.videoObject?.muxPlaybackId
                  ? video[0]?.videoObject?.muxPlaybackId
                  : ""
              }
              playbackPolicy={video[0]?.videoObject?.playbackPolicy ?? "public"}
              numberOfClips={video.length}
              href={
                programmeSlug && unitSlug
                  ? resolveOakHref({
                      page: "lesson-media",
                      lessonSlug: video[0]?.slug ? video[0]?.slug : "",
                      programmeSlug,
                      unitSlug,
                    })
                  : resolveOakHref({
                      page: "lesson-media-canonical",
                      lessonSlug: video[0]?.slug ? video[0]?.slug : "",
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
