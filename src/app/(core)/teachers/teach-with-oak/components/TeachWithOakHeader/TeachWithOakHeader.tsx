"use client";
import {
  OakFlex,
  parseSpacing,
  parseBorder,
  parseColor,
  OakBox,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { Suspense } from "react";

import { BackToLessonButton } from "./BackToLessonButton/BackToLessonButton";

import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

const HeaderLayout = styled(OakFlex)`
  display: flex;
  flex-direction: row;
`;

const StyledAboutSharedHeaderImage = styled(AboutSharedHeaderImage)`
  width: ${parseSpacing("100%")};

  img {
    position: relative !important;
    width: ${parseSpacing("100%")} !important;
    height: auto !important;
    border: ${parseBorder("border-solid-xxl")} ${parseColor("border-primary")};
  }
`;

export function TeachWithOakHeader() {
  const imageUrl = getCloudinaryImageUrl(
    "v1789976818/teacher-journey/teach-with-oak-header-image.jpg",
  );

  return (
    <OakBox
      $mt={["spacing-56", "spacing-80", "spacing-56"]}
      $mb={["spacing-56", "spacing-80", "spacing-72"]}
    >
      <Suspense>
        <BackToLessonButton />
      </Suspense>
      <HeaderLayout>
        <AboutSharedHeader
          title={"The thinking behind Oak lessons"}
          content={
            "See how our lessons are designed to support learning - and make the most of them in your classroom."
          }
          titleHighlight={"bg-decorative2-main"}
          showImageOverflow={true}
        >
          <StyledAboutSharedHeaderImage imageUrl={imageUrl} />
        </AboutSharedHeader>
      </HeaderLayout>
    </OakBox>
  );
}
