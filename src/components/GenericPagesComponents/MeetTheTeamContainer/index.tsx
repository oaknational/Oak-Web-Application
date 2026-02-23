import {
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakP,
} from "@oaknational/oak-components";
import { forwardRef } from "react";

export type MeetTheTeamContainerProps = {
  title: string;
  text?: string | null;
  children: React.ReactNode;
  anchor?: string;
};
export const MeetTheTeamContainer = forwardRef<
  HTMLDivElement,
  Readonly<MeetTheTeamContainerProps>
>(({ title, text, children, anchor }, ref) => {
  return (
    <OakBox
      ref={ref}
      id={anchor}
      $background={"bg-decorative5-very-subdued"}
      $pa={["spacing-16", "spacing-24", "spacing-24"]}
      $borderRadius={"border-radius-m2"}
      $color={"text-primary"}
    >
      <OakFlex $gap={["spacing-32"]} $flexDirection={"column"}>
        <OakFlex $gap={["spacing-16"]} $flexDirection={"column"}>
          <OakHeading tag="h2" $font={["heading-5", "heading-3", "heading-3"]}>
            {title}
          </OakHeading>
          {text && <OakP $font={"body-1"}>{text}</OakP>}
        </OakFlex>
        <OakGrid
          as="ul"
          $gridTemplateColumns={`repeat(auto-fit, minmax(200px, 1fr))`}
          $cg={"spacing-16"}
          $rg={"spacing-16"}
          $pa={"spacing-0"}
          $ma={"spacing-0"}
        >
          {children}
        </OakGrid>
      </OakFlex>
    </OakBox>
  );
});
