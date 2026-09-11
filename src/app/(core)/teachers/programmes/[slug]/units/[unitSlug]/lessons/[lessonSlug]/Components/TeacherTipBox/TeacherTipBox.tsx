import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

import { MaybeTeachWithOakCard } from "../TeachWithOakCard/TeachWithOakCard";

import { resolveOakHref } from "@/common-lib/urls";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getLessonSlugFromProgrammeState } from "@/context/TeacherBrowseAnalytics/utils/getLessonSlugFromProgrammeState";

type TeacherTipBoxProps = {
  tips: string[];
};

const TeacherTipBox = (props: TeacherTipBoxProps) => {
  const { tips } = props;

  const programmeState = useTeacherBrowseAnalytics((s) => s.programmeState);
  const lessonSlug = getLessonSlugFromProgrammeState(programmeState);

  const lessonHref =
    programmeState?.browseLevel === "lesson" && lessonSlug
      ? resolveOakHref({
          page: "lesson-overview",
          lessonSlug,
          programmeSlug: programmeState.programmeSlug,
          unitSlug: programmeState.unit.slug,
        })
      : undefined;

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
      {lessonHref && <MaybeTeachWithOakCard returnTo={lessonHref} />}
    </OakFlex>
  );
};

export default TeacherTipBox;
