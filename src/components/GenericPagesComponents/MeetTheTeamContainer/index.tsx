import { OakBox, OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

export type MeetTheTeamContainerProps = {
  title: string;
  text?: string | null;
  children: React.ReactNode;
};
export function MeetTheTeamContainer({
  title,
  text,
  children,
}: MeetTheTeamContainerProps) {
  return (
    <OakBox
      $background={"bg-decorative5-very-subdued"}
      $pa={["spacing-16", "spacing-24", "spacing-24"]}
    >
      <OakFlex $gap={["spacing-16"]} $flexDirection={"column"}>
        <OakHeading tag="h2" $font={["heading-5", "heading-3", "heading-3"]}>
          {title}
        </OakHeading>
        {text && <OakP $font={"body-1"}>{text}</OakP>}
        <OakFlex $gap={"spacing-16"} $flexWrap={"wrap"}>
          {children}
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
}
