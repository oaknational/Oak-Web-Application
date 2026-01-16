import {
  OakBox,
  OakFlex,
  OakHeading,
  OakSecondaryLink,
} from "@oaknational/oak-components";
import React from "react";

type CurricYearCardProps = {
  yearTitle: string;
  yearSubheading?: string | null;
  additional?: React.ReactNode;
  children: React.ReactNode;
  isExamboard: boolean;
  timetablingUrl?: string;
};

export function CurricYearCard({
  yearTitle,
  yearSubheading,
  additional,
  children,
  isExamboard,
  timetablingUrl,
}: Readonly<CurricYearCardProps>) {
  return (
    <OakBox
      $background={
        isExamboard ? "bg-decorative4-subdued" : "bg-decorative4-very-subdued"
      }
      $pa={"spacing-32"}
      $position={"relative"}
      $mb={"spacing-32"}
      $borderRadius={"border-radius-s"}
      className="mobileYearDisplay"
    >
      <OakFlex $flexDirection={"row"} $justifyContent={"space-between"}>
        <OakHeading
          tag="h3"
          $font={["heading-5", "heading-4"]}
          $mb={yearSubheading ? "spacing-12" : "spacing-16"}
          data-testid="year-heading"
        >
          {yearTitle}
        </OakHeading>
        {timetablingUrl && (
          <OakSecondaryLink
            href={timetablingUrl}
            iconName="external"
            isTrailingIcon
          >
            Map to school timetable
          </OakSecondaryLink>
        )}
      </OakFlex>
      {yearSubheading && (
        <OakHeading
          tag="h4"
          $font={["heading-7", "heading-6"]}
          $mb="spacing-16"
          data-testid="year-subheading"
        >
          {yearSubheading}
        </OakHeading>
      )}
      <OakBox>{additional}</OakBox>
      <OakBox>{children}</OakBox>
    </OakBox>
  );
}
