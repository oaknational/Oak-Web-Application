import { ExamboardData } from "@/components/PupilComponents/BrowseExamboardSelector";
import OakError from "@/errors/OakError";

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
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  return v;
};
