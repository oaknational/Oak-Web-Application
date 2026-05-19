import { LessonReviewSection } from "@/components/PupilComponents/LessonEngineProvider";

type SectionResults = Partial<
  Record<LessonReviewSection, { isComplete?: boolean } | undefined>
>;

export const pickSectionProgress = ({
  section,
  sectionResults,
}: {
  section: LessonReviewSection;
  sectionResults: SectionResults;
}): "complete" | "in-progress" | "not-started" => {
  if (sectionResults[section]?.isComplete) {
    return "complete";
  }

  if (sectionResults[section]) {
    return "in-progress";
  }

  return "not-started";
};
