import { z } from "zod";
import {
  lessonContentSchema as lessonContentSchemaFull,
  syntheticUnitvariantLessonsByKsSchema,
  LessonContentCamel as LessonContentCamelFull,
  SyntheticUnitvariantLessonsByKsCamel,
  subjectSlugs,
} from "@oaknational/oak-curriculum-schema";

import { lessonPathwaySchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { lessonDownloadTypeSchema } from "@/common-lib/lessonDownloads";

export const lessonContentSchema = lessonContentSchemaFull.omit({
  _state: true,
  exit_quiz: true,
  starter_quiz: true,
  video_duration: true,
});

type LessonContentCamel = Omit<
  LessonContentCamelFull,
  "state" | "exitQuiz" | "starterQuiz" | "videoDuration"
>;

export type LessonOverviewContent = Omit<
  LessonContentCamel,
  "starterQuiz" | "exitQuiz"
> & {
  starterQuiz: QuizQuestion[];
  exitQuiz: QuizQuestion[];
};

export const lessonOverviewDownloads = z.array(
  z.object({
    exists: z.boolean().nullable(),
    type: lessonDownloadTypeSchema,
  }),
);

export type LessonOverviewDownloads = z.infer<typeof lessonOverviewDownloads>;

export const canonicalLessonHubPathwaySchema = lessonPathwaySchema.pick({
  programmeSlug: true,
  unitSlug: true,
  unitTitle: true,
  subjectTitle: true,
  examBoardTitle: true,
  tierTitle: true,
  yearGroupTitle: true,
  pathwayTitle: true,
});

export const canonicalLessonHubSchema = z.object({
  lessonTitle: z.string(),
  subjectSlug: subjectSlugs,
  pathways: z.array(canonicalLessonHubPathwaySchema),
});

export type CanonicalLessonHubData = z.infer<typeof canonicalLessonHubSchema>;

export const lessonBrowseDataByKsSchema =
  syntheticUnitvariantLessonsByKsSchema.omit({
    null_unitvariant_id: true,
    unitvariant_id: true,
  });

export type LessonBrowseDataByKs = Omit<
  SyntheticUnitvariantLessonsByKsCamel,
  "nullUnitvariantId" | "unitvariantId"
>;
