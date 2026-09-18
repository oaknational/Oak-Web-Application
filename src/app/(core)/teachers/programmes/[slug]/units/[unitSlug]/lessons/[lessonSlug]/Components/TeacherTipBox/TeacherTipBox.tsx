import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

import { MaybeTeachWithOakCard } from "../TeachWithOakCard/TeachWithOakCard";

import { useProgrammeState } from "@/context/TeacherBrowseAnalytics/hooks/useProgrammeState";

type TeacherTipBoxProps = {
  tips: string[];
};

const TeacherTipBox = (props: TeacherTipBoxProps) => {
  const { tips } = props;

  const { currentHref, lessonState } = useProgrammeState();

  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"spacing-32"}
      $background={"bg-decorative2-subdued"}
      $borderRadius={"border-radius-l"}
      data-testid="teacher-tip-container"
    >
      <OakFlex $pa={"spacing-24"} $flexDirection={"column"} $gap={"spacing-8"}>
        <OakHeading tag="h3" $font={"heading-7"}>
          Teacher tip
        </OakHeading>
        {tips.map((tip) => (
          <OakP $font={"body-2"} key={tip}>
            {tip}
          </OakP>
        ))}
      </OakFlex>
      {currentHref && lessonState && (
        <MaybeTeachWithOakCard
          returnTo={currentHref}
          lessonName={lessonState.lesson.title}
          unitName={lessonState.unit.title}
        />
      )}
    </OakFlex>
  );
};

export default TeacherTipBox;
