import {
  KeyStageTitleValueType,
  TeacherShareInitiatedProperties,
} from "@/browser-lib/avo/Avo";

export type CurriculumTrackingProps = {
  lessonSlug: string | null;
  lessonName: string | null;
  unitSlug: string | null;
  unitName: string | null;
  subjectSlug: string | null;
  subjectTitle: string | null;
  keyStageSlug: string | null;
  keyStageTitle: KeyStageTitleValueType | null;
};

export type CoreProperties = Pick<
  TeacherShareInitiatedProperties,
  | "platform"
  | "product"
  | "engagementIntent"
  | "componentType"
  | "eventVersion"
  | "analyticsUseCase"
>;
