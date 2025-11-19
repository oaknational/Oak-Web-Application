import { OakFlex, OakSpan } from "@oaknational/oak-components";

type CurricLessonWarningProps = {
  count: number;
  total: number;
};
export function CurricLessonWarning({
  count,
  total,
}: Readonly<CurricLessonWarningProps>) {
  return (
    <OakFlex $alignItems={"center"} $gap={"spacing-8"}>
      <OakFlex
        $borderRadius={"border-radius-circle"}
        $background={"icon-warning"}
        $width={"spacing-24"}
        $height={"spacing-24"}
      >
        {/* <OakIcon iconName="warning" /> */}
      </OakFlex>{" "}
      <OakSpan $color={"black"}>
        {count}/{total} lessons
      </OakSpan>
    </OakFlex>
  );
}
