import {
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakP
} from "@oaknational/oak-components";

export type MeetTheTeamContainerProps = {
  title: string;
  text?: string | null;
  children: React.ReactNode;
  anchor?: string;
};
export function MeetTheTeamContainer({
  title,
  text,
  children,
  anchor,
}: Readonly<MeetTheTeamContainerProps>) {
  return (
    <OakBox
      $background={"bg-decorative5-very-subdued"}
      $pa={["spacing-16", "spacing-24", "spacing-24"]}
      id={anchor}
    >
      <OakFlex $gap={["spacing-32"]} $flexDirection={"column"}>
        <OakFlex $gap={["spacing-16"]} $flexDirection={"column"}>
          <OakHeading tag="h2" $font={["heading-5", "heading-3", "heading-3"]}>
            {title}
          </OakHeading>
          {text && <OakP $font={"body-1"}>{text}</OakP>}
        </OakFlex>
        <OakGrid
          $gridTemplateColumns={`repeat(auto-fit, minmax(192px, 1fr))`}
          $cg={"spacing-16"}
          $rg={"spacing-16"}
        >
          {children}
        </OakGrid>
      </OakFlex>
    </OakBox>
  );
}
