import { LessonSection } from "@/components/PupilComponents/lessonSections";
import {
  AdditionalFile,
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { LessonShareVariant } from "@/pages-helpers/pupil";

export type WorksheetInfo = {
  item: string;
  exists: boolean;
  fileSize: string | undefined;
  ext: string | undefined;
}[];

export type PupilLessonPageType = "preview" | "canonical" | "browse";

export type PupilLessonPageProps = {
  browseData: LessonBrowseData;
  lessonContent: LessonContent;
  hasWorksheet: boolean;
  backUrl?: string | null;
  initialSection: LessonSection;
  pageType: PupilLessonPageType;
  hasAdditionalFiles: boolean;
  additionalFiles: AdditionalFile[] | null;
  worksheetInfo: WorksheetInfo | null;
  variant: LessonShareVariant | null;
};
