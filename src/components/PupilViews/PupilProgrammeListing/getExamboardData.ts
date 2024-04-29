import { ExamboardData } from "@/components/PupilComponents/BrowseExamboardSelector";

export const getExamboardData = ({
  examboardSlug,
  availableExamboards,
}: {
  examboardSlug: ExamboardData["examboardSlug"];
  availableExamboards: ExamboardData[];
}): ExamboardData => {
  const v = availableExamboards.find(
    (examboard) => examboard.examboardSlug === examboardSlug,
  );

  if (!v) {
    throw new Error("invalid examboardSlug");
  }

  return v;
};
