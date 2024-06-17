import React, { FC } from "react";
import styled from "styled-components";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakTertiaryButton,
  OakImage,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";

const StyledOakFlex = styled(OakFlex)`
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
`;

type NewContentBannerProps = {
  subjectTitle: string;
  programmeSlug: string;
};

const NewContentBanner: FC<NewContentBannerProps> = ({
  subjectTitle,
  programmeSlug,
}) => {
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
          href={resolveOakHref({
            page: "unit-index",
            programmeSlug: programmeSlug,
          })}
        >
          {`Go to new ${subjectTitle} content`}
        </OakTertiaryButton>
      </OakFlex>
      <OakFlex
        $display={["none", "none", "block"]}
        $borderColor={"black"}
        $borderStyle={"solid"}
        $ba={"border-solid-m"}
        // $alignContent={"center"}
        $justifyContent={"center"}
        $width={"all-spacing-18"}
        $height={"all-spacing-15"}
        $alignItems={"center"}
      >
        <OakImage
          $display={["none", "none", "block"]}
          $width={"all-spacing-18"}
          $height={"all-spacing-15"}
          alt="a man standing in front of a blackboard with a bunch of objects on top of his head and hands in the air"
          src={`https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1699887218/svg-illustrations/xrazqgtjmbdf1clz8wic`}
        />
      </OakFlex>
    </StyledOakFlex>
  );
};

export default NewContentBanner;
