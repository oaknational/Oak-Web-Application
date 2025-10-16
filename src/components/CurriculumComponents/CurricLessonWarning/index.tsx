import { OakFlex } from "@oaknational/oak-components";

type CurricLessonWarningProps = {
  count: number;
  total: number;
};
export function CurricLessonWarning({
  count,
  total,
}: CurricLessonWarningProps) {
  return (
    <OakFlex $alignItems={"center"} $gap={"space-between-ssx"}>
      <OakFlex
        $borderRadius={"border-radius-circle"}
        $background={"icon-warning"}
        $width={"all-spacing-6"}
        $height={"all-spacing-6"}
      >
        {/* <OakIcon iconName="warning" /> */}
      </OakFlex>{" "}
      {count}/{total} lessons
    </OakFlex>
  );
}
