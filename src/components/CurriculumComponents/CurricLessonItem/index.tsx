import {
  OakFlex,
  OakSecondaryLink,
  OakSpan,
} from "@oaknational/oak-components";

type CurricLessonItemProps = {
  number: number;
  title: string;
  href?: string;
};
export function CurricLessonItem({
  number,
  title,
  href,
}: Readonly<CurricLessonItemProps>) {
  return (
    <OakFlex
      $borderRadius={"border-radius-s"}
      $overflow={"hidden"}
      $color={"text-primary"}
    >
      <OakFlex
        $background={"bg-decorative4-main"}
        $ph={"spacing-20"}
        $alignItems={"center"}
        $font={"heading-6"}
        data-testid="curric-lesson-item-number"
      >
        {number}
      </OakFlex>
      <OakFlex
        $flexGrow={1}
        $alignItems={"center"}
        $background={"bg-decorative4-very-subdued"}
        $ph={"spacing-20"}
        $pv={"spacing-12"}
        $gap={"spacing-24"}
      >
        <OakFlex $flexGrow={1} data-testid="curric-lesson-title">
          <OakSpan $font={"heading-7"}>{title}</OakSpan>
        </OakFlex>
        {href && (
          <OakFlex $flexShrink={0}>
            <OakSecondaryLink
              href={href}
              isTrailingIcon={true}
              iconName="arrow-right"
            >
              Go to lesson
            </OakSecondaryLink>
          </OakFlex>
        )}
      </OakFlex>
    </OakFlex>
  );
}
