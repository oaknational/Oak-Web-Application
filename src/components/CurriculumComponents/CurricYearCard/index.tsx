import { OakBox, OakHeading } from "@oaknational/oak-components";
import React from "react";

type CurricYearCardProps = {
  yearTitle: string;
  yearSubheading?: string | null;
  additional?: React.ReactNode;
  children: React.ReactNode;
};
export function CurricYearCard({
  yearTitle,
  yearSubheading,
  additional,
  children,
}: CurricYearCardProps) {
  return (
    <OakBox
      $background={"pink30"}
      $pa={"inner-padding-xl2"}
      $position={"relative"}
      $mb={"space-between-m2"}
      $borderRadius={"border-radius-s"}
      className="mobileYearDisplay"
    >
      <OakHeading
        tag="h3"
        $font={["heading-5", "heading-4"]}
        $mb={yearSubheading ? "space-between-xs" : "space-between-s"}
        data-testid="year-heading"
      >
        {yearTitle}
      </OakHeading>

      {yearSubheading && (
        <OakHeading
          tag="h4"
          $font={["heading-7", "heading-6"]}
          $mb="space-between-s"
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
