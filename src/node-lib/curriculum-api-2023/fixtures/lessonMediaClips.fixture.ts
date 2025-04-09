import {
  mediaClipsFixture,
  additionalCyclesFixture,
} from "@oaknational/oak-curriculum-schema";

import {
  LessonMediaClipsData,
  MediaClipListCamelCase,
} from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const lessonMediaClipsFixtures = (
  partial?: Partial<LessonMediaClipsData>,
): LessonMediaClipsData => {
  return {
    programmeSlug: "physical-education-ks4",
    lessonSlug: "running-as-a-team",
    lessonTitle: "Running as a team",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    unitSlug: "running-and-jumping",
    unitTitle: "Running and jumping",
    subjectSlug: "physical-education",
    subjectTitle: "Physical Education",
    examBoardSlug: null,
    examBoardTitle: null,
    tierSlug: null,
    tierTitle: null,
    mediaClips: keysToCamelCase(
      mediaClipsFixture().media_clips,
    ) as MediaClipListCamelCase,
    lessonOutline: [
      { lessonOutline: "This lesson is about running as a team" },
    ],
    ...partial,
  };
};

export const additionalCycles = keysToCamelCase(
  additionalCyclesFixture.media_clips,
);

export default lessonMediaClipsFixtures;
