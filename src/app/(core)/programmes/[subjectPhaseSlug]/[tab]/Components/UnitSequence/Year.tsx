import {
  OakBox,
  OakHeading,
  OakUiRoleToken,
} from "@oaknational/oak-components";
import React from "react";

type ProgrammeYearProps = {
  year: string;
  yearTitle: string;
  yearSubheading?: string | null;
  additional?: React.ReactNode;
  children: React.ReactNode;
};

const yearToBackgroundColor: Record<string, OakUiRoleToken> = {
  "1": "bg-decorative3-very-subdued",
  "2": "bg-decorative1-subdued",
  "3": "bg-decorative2-subdued",
  "4": "bg-decorative4-subdued",
  "5": "bg-decorative5-very-subdued",
  "6": "bg-decorative4-very-subdued",
  "7": "bg-decorative3-very-subdued",
  "8": "bg-decorative1-subdued",
  "9": "bg-decorative2-subdued",
  "10": "bg-decorative4-subdued",
  "11": "bg-decorative5-very-subdued",
};

export function ProgrammeYear({
  year,
  yearTitle,
  yearSubheading,
  additional,
  children,
}: Readonly<ProgrammeYearProps>) {
  return (
    <>
      <OakBox
        $pa="spacing-20"
        $btr="border-radius-l"
        $background={yearToBackgroundColor[year] ?? "bg-decorative1-subdued"}
        $mr="spacing-16"
        $maxWidth="fit-content"
      >
        <OakHeading
          tag="h3"
          $font="heading-5"
          $overflow="hidden"
          $textOverflow="ellipsis"
          $whiteSpace="nowrap"
        >
          {yearTitle}
        </OakHeading>
      </OakBox>
      <OakBox
        $background={yearToBackgroundColor[year] ?? "bg-decorative1-subdued"}
        $pa={"spacing-20"}
        $position={"relative"}
        $mb={"spacing-48"}
        $bbr="border-radius-l"
        $btrr="border-radius-l"
      >
        {yearSubheading && (
          <OakHeading tag="h4" $font="heading-light-7" $mb="spacing-16">
            {yearSubheading}
          </OakHeading>
        )}
        <OakBox>{additional}</OakBox>
        <OakBox>{children}</OakBox>
      </OakBox>
    </>
  );
}
