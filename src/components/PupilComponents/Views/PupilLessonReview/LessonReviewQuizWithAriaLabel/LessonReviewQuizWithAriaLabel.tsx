import { useEffect, useRef } from "react";
import { OakLessonReviewQuiz } from "@oaknational/oak-components";

export type LessonReviewQuizWithAriaLabelProps = React.ComponentProps<
  typeof OakLessonReviewQuiz
> & {
  resultsButtonAriaLabel: string;
};

/**
 * `OakLessonReviewQuiz` renders a generic "Results" toggle.
 * We need that toggle’s accessible name to include the section context.
 *
 * We do this (without changing the UI label) by setting `aria-label` on the
 * internal `button[aria-expanded]` once the component has rendered.
 *
 * The wrapper uses `display: contents` to preserve layout (i.e. this wrapper
 * does not become a flex/grid item).
 */
const LessonReviewQuizWithAriaLabel = (
  props: LessonReviewQuizWithAriaLabelProps,
) => {
  const { resultsButtonAriaLabel, ...quizProps } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const applyLabel = () => {
      const button = root.querySelector<HTMLButtonElement>(
        "button[aria-expanded]",
      );
      if (!button) return false;
      button.setAttribute("aria-label", resultsButtonAriaLabel);
      return true;
    };

    if (applyLabel()) return;

    const observer = new MutationObserver(() => {
      if (applyLabel()) observer.disconnect();
    });

    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [resultsButtonAriaLabel]);

  return (
    <div ref={containerRef} style={{ display: "contents" }}>
      <OakLessonReviewQuiz {...quizProps} />
    </div>
  );
};

export default LessonReviewQuizWithAriaLabel;
