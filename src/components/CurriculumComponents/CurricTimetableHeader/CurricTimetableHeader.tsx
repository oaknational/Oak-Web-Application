import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
} from "@oaknational/oak-components";
import React from "react";

import Illustration from "@/components/SharedComponents/Illustration";
import { IllustrationSlug } from "@/image-data";

const logoSrc = `https://cdn.sanity.io/images/cuvjke51/production/e9cc7ae43ca35576d95d0c3ef22f76e0aee14eac-1920x880.svg`;

type CurricTimetableHeaderProps = {
  titleSlot: React.ReactNode;
  additionalSlot?: React.ReactNode;
  illustrationSlug: IllustrationSlug;
};
export function CurricTimetableHeader({
  titleSlot,
  additionalSlot,
  illustrationSlug,
}: CurricTimetableHeaderProps) {
  return (
    <OakBox
      $background={"bg-decorative1-main"}
      $borderRadius={"border-radius-xl"}
      $pa={"inner-padding-xl5"}
      $pt={"inner-padding-xl4"}
      $pb={"inner-padding-xl3"}
    >
      <OakFlex $flexDirection={"row"}>
        <OakFlex $flexDirection={"column"} $flexGrow={1}>
          <OakFlex $pb={"inner-padding-s"} $alignItems={"start"}>
            <OakImage
              src={logoSrc}
              style={{ height: 52, width: 114 }}
              alt="Oak National Academy"
            />
          </OakFlex>
          <OakFlex>
            <OakFlex
              $gap={"all-spacing-9"}
              $flexDirection={"column"}
              $flexGrow={1}
            >
              <OakHeading
                tag="h1"
                $font={"heading-2"}
                data-testid="timetable-header-title"
              >
                {titleSlot}
              </OakHeading>
              <OakBox data-testid="timetable-header-additional">
                {additionalSlot}
              </OakBox>
            </OakFlex>
          </OakFlex>
        </OakFlex>
        <OakFlex
          $display={["none", "none", "flex"]}
          $flexGrow={1}
          $flexShrink={1}
          $position={"relative"}
        >
          <Illustration
            slug={illustrationSlug}
            $objectFit="contain"
            $objectPosition={"bottom right"}
            fill
            $height={"100%"}
          />
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
}
