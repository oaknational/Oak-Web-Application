import { CommonMisconception } from "@/components/CommonMisconceptions/CommonMisconceptions";
import { KeyLearningPoint } from "@/components/KeyLearningPoints/KeyLearningPoints";
import { KeyWord } from "@/components/KeyWords/KeyWords";
import {
  ContentGuidance,
  Equipment,
} from "@/components/LessonRequirements/LessonRequirements";
import { TeacherTip } from "@/components/TeacherTips/TeacherTips";
import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";

export type LessonBase = {
  lessonTitle: string;
  lessonSlug: string;
  supervisionLevel: string | null;
  contentGuidance?: ContentGuidance[] | null;
  misconceptionsAndCommonMistakes?: CommonMisconception[] | null;
  lessonKeywords?: KeyWord[] | null;
  teacherTips?: TeacherTip[] | null;
  videoMuxPlaybackId: string | null;
  videoWithSignLanguageMuxPlaybackId: string | null;
  lessonEquipmentAndResources?: Equipment[] | null;
  presentationUrl: string | null;
  worksheetUrl: string | null;
  isWorksheetLandscape?: boolean | null;
  transcriptSentences: string[] | null;
  starterQuiz?: LessonOverviewQuizData;
  exitQuiz?: LessonOverviewQuizData;
  expired?: boolean | null;
  additionalMaterialUrl: string | null;
  hasCopyrightMaterial?: boolean | null;
  keyLearningPoints?: KeyLearningPoint[] | null;
};

export type LessonPathway = {
  keyStageTitle: string;
  keyStageSlug: string;
  subjectTitle: string;
  subjectSlug: string;
  unitTitle: string;
  unitSlug: string;
  programmeSlug: string;
  yearSlug?: string | null;
  yearTitle?: string | null;
  tierTitle?: string | null;
  tierSlug?: string | null;
  examboardTitle?: string | null;
  examboardSlug?: string | null;
};

export type LessonOverviewCanonical = LessonBase & {
  isCanonical: true;
  pathways: LessonPathway[];
};

export type LessonOverviewInPathway = LessonBase & {
  isCanonical: false;
  keyStageTitle: string;
  keyStageSlug: string;
  subjectTitle: string;
  subjectSlug: string;
  unitTitle: string;
  unitSlug: string;
  programmeSlug: string;
};
