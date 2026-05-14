import { LessonReviewSection } from "@/components/PupilComponents/LessonEngineProvider";

type SectionResults = Partial<
  Record<LessonReviewSection, { isComplete?: boolean } | undefined>
>;

export const pickNextIncompleteSection = ({
  lessonReviewSections,
  sectionResults,
}: {
  lessonReviewSections: Readonly<LessonReviewSection[]>;
  sectionResults: SectionResults;
}): LessonReviewSection | "review" => {
  return (
    lessonReviewSections.find(
      (section) => !sectionResults[section]?.isComplete,
    ) ?? "review"
  );
};
