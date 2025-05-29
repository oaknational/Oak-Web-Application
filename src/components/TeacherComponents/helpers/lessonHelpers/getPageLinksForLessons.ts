import { pick } from "lodash";

import { checkIsResourceCopyrightRestricted } from "../downloadAndShareHelpers/downloadsCopyright";

import {
  GetPageLinksForLessonProps,
  LessonPageLinkAnchorId,
} from "./lesson.helpers";

import { CopyrightContent } from "@/node-lib/curriculum-api-2023/shared.schema";

export const getPageLinksForLesson = (
  lesson: GetPageLinksForLessonProps,
  copyrightContent: CopyrightContent,
  mediaClipsLabel?: string,
): {
  label: string;
  anchorId: LessonPageLinkAnchorId;
}[] => {
  const PAGE_LINKS: {
    label: string;
    anchorId: LessonPageLinkAnchorId;
    condition: (lesson: GetPageLinksForLessonProps) => boolean;
  }[] = [
    {
      label: "Lesson guide",
      anchorId: "lesson-guide",
      condition: (lesson) => Boolean(lesson.lessonGuideUrl),
    },
    {
      label: "Slide deck",
      anchorId: "slide-deck",
      condition: (lesson) =>
        Boolean(
          lesson.presentationUrl &&
            !checkIsResourceCopyrightRestricted(
              "presentation",
              copyrightContent,
            ),
        ),
    },
    {
      label: mediaClipsLabel || "Video & audio",
      anchorId: "media-clips",
      condition: (lesson) => lesson.hasMediaClips,
    },
    {
      label: "Lesson details",
      anchorId: "lesson-details",
      condition: () => true,
    },
    {
      label: "Lesson video",
      anchorId: "video",
      condition: (lesson) => Boolean(lesson.videoMuxPlaybackId),
    },
    {
      label: "Worksheet",
      anchorId: "worksheet",
      condition: (lesson) => Boolean(lesson.worksheetUrl),
    },
    {
      label: "Starter quiz",
      anchorId: "starter-quiz",
      condition: (lesson) =>
        Boolean(lesson.starterQuiz && lesson.starterQuiz.length > 0),
    },
    {
      label: "Exit quiz",
      anchorId: "exit-quiz",
      condition: (lesson) =>
        Boolean(lesson.exitQuiz && lesson.exitQuiz.length > 0),
    },
    {
      label: "Additional material",
      anchorId: "additional-material",
      condition: (lesson) => Boolean(lesson.additionalMaterialUrl),
    },
  ];

  return PAGE_LINKS.filter((pageLink) => pageLink.condition(lesson)).map(
    (lesson) => pick(lesson, ["label", "anchorId"]),
  );
};
