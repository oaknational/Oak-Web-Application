import { TextItem } from "@oaknational/oak-curriculum-schema";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

const ENABLE_SSR = true;

type StemProps = {
  stem: TextItem;
};
export function Stem({ stem }: StemProps) {
  // TODO: This should also deal with rendering <OakCodeRenderer/> as I've removed that else where
  // See `shortAnswerTitleFormatter` for the logic behind it all
  if (ENABLE_SSR) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: removeMarkdown(stem.html),
        }}
      />
    );
  } else {
    return <MathJaxWrap>{stem.text}</MathJaxWrap>;
  }
}
