import React, { FC } from "react";
import styled from "styled-components";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakTertiaryButton,
  OakImage,
} from "@oaknational/oak-components";

import { resolveOakHref, OakPageType } from "@/common-lib/urls";

/**
 * ! - Render on the correct pages ✅
 * ! - Link to the correct page - remove - l ✅
 * ! - Fix type error ✅
 * ! - Add images to CMS ✅
 */

const StyledOakFlex = styled(OakFlex)`
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
`;

type NewContentBannerProps = {
  subjectTitle: string;
  programmeSlug: string;
  keyStageSlug: string;
  subjectSlug: string;
};

const renderContentBannerArray = [
  { keyStageSlug: "ks1", subjectSlug: "english" },
  { keyStageSlug: "ks1", subjectSlug: "geography" },
  { keyStageSlug: "ks1", subjectSlug: "history" },
  { keyStageSlug: "ks1", subjectSlug: "science" },
  { keyStageSlug: "ks2", subjectSlug: "english" },
  { keyStageSlug: "ks2", subjectSlug: "english-grammar" },
  { keyStageSlug: "ks2", subjectSlug: "english-reading-for-pleasure" },
  { keyStageSlug: "ks2", subjectSlug: "english-spelling" },
  { keyStageSlug: "ks2", subjectSlug: "geography" },
  { keyStageSlug: "ks2", subjectSlug: "history" },
  { keyStageSlug: "ks2", subjectSlug: "science" },
  { keyStageSlug: "ks3", subjectSlug: "english" },
  { keyStageSlug: "ks3", subjectSlug: "history" },
  { keyStageSlug: "ks3", subjectSlug: "science" },
  { keyStageSlug: "ks4", subjectSlug: "biology" },
  { keyStageSlug: "ks4", subjectSlug: "chemistry" },
  { keyStageSlug: "ks4", subjectSlug: "combined-science" },
  { keyStageSlug: "ks1", subjectSlug: "maths" },
  { keyStageSlug: "ks2", subjectSlug: "maths" },
  { keyStageSlug: "ks3", subjectSlug: "maths" },
  { keyStageSlug: "ks4", subjectSlug: "maths" },
];

const removeSuffix = (str: string) => {
  if (str.endsWith("-l")) {
    return str.slice(0, -2);
  }
  return str;
};

const NewContentBanner: FC<NewContentBannerProps> = ({
  subjectTitle,
  programmeSlug,
  keyStageSlug,
  subjectSlug,
}) => {
  const renderComponent = renderContentBannerArray.some((item) => {
    return (
      item.keyStageSlug === keyStageSlug && item.subjectSlug === subjectSlug
    );
  });

  let navigationPage: OakPageType = "unit-index";
  let progSlug = removeSuffix(programmeSlug);

  if (
    keyStageSlug === "ks4" &&
    (subjectSlug === "combined-science" ||
      subjectSlug === "biology" ||
      subjectSlug === "chemistry" ||
      subjectSlug === "maths")
  ) {
    navigationPage = "programme-index";
  }

  if (
    keyStageSlug === "ks2" &&
    (subjectSlug === "english-reading-for-pleasure" ||
      subjectSlug === "english-spelling" ||
      subjectSlug === "english-grammar")
  ) {
    progSlug = "english-primary-ks2";
  }

  if (!renderComponent) {
    return null;
  }

  const resolveHref =
    navigationPage === "programme-index"
      ? resolveOakHref({
          page: "programme-index",
          keyStageSlug,
          subjectSlug,
        })
      : resolveOakHref({
          page: navigationPage,
          programmeSlug: progSlug,
        });

  return (
    <StyledOakFlex
      $flexDirection={"row"}
      $alignItems={"center"}
      $justifyContent={"space-between"}
      $mv={"space-between-m"}
      $maxWidth={"all-spacing-24"}
      $borderColor={"grey40"}
      $dropShadow={"drop-shadow-grey"}
      $borderRadius={"border-radius-m2"}
      $gap={"space-between-m2"}
      $pa={"inner-padding-xl"}
    >
      <OakFlex
        $flexDirection={"column"}
        $width={"all-spacing-22"}
        $gap={"space-between-xs"}
      >
        <OakHeading tag="h3" $font={"heading-5"}>
          Designed for classroom
        </OakHeading>
        <OakP>
          Adaptable lesson planning resources that are made by teachers, checked
          by subject experts and tested in classroom.
        </OakP>
        <OakTertiaryButton
          iconName={"chevron-right"}
          isTrailingIcon
          element="a"
          href={resolveHref}
        >
          {`Go to new ${subjectTitle} content`}
        </OakTertiaryButton>
      </OakFlex>
      <OakFlex
        $display={["none", "none", "block"]}
        $justifyContent={"center"}
        $width={"all-spacing-18"}
        $height={"all-spacing-15"}
        $alignItems={"center"}
      >
        <OakImage
          $display={["none", "none", "block"]}
          $width={"all-spacing-18"}
          $height={"all-spacing-15"}
          alt="new content banner image"
          src={`https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1718639479/teacher-journey/content-banner.png`}
        />
      </OakFlex>
    </StyledOakFlex>
  );
};

export default NewContentBanner;
