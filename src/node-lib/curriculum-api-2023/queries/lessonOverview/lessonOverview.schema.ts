import { z } from "zod";

import { lessonOverviewData } from "../../../curriculum-api";

// OLD SCHEMA

const lessonOverviewSchema = lessonOverviewData;

export type LessonOverviewPageData = z.infer<typeof lessonOverviewData>;

export default lessonOverviewSchema;
