import { TextItem } from "@oaknational/oak-curriculum-schema";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";

type StemProps = {
  stem: TextItem;
};
export function Stem({ stem }: StemProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: removeMarkdown(stem.html),
      }}
    />
  );
}
