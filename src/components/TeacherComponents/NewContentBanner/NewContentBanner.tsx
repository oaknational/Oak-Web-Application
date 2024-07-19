import React, { FC, useState } from "react";
import styled from "styled-components";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import removeLegacySlugSuffix from "@/utils/slugModifiers/removeLegacySlugSuffix";
import { resolveOakHref, OakPageType } from "@/common-lib/urls";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

const StyledOakFlex = styled(OakFlex)`
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
`;

const StyledVideoPlayerFlex = styled(OakFlex)<{ expand: boolean }>`
  transition: width 0.4s ease-in;

  p {
    @media (min-width: 768px) {
      display: ${({ expand }) => (expand ? "none" : "block")};
    }
  }
`;

type NewContentBannerProps = {
  subjectTitle: string;
  programmeSlug: string;
  keyStageSlug: string;
  subjectSlug: string;
  isUnitListing?: boolean;
  isLegacy?: boolean;
};

const videoPlaybackID = "CjDAe0153o6v65Te4npM9165RqrAJd6YrSeOufA02RKLE";

const renderContentBannerRecord: Record<string, string[]> = {
  ks1: ["english", "geography", "history", "science", "maths"],
  ks2: [
    "english",
    "english-grammar",
    "english-reading-for-pleasure",
    "english-spelling",
    "geography",
    "history",
    "science",
    "maths",
  ],
  ks3: ["english", "history", "science", "maths"],
  ks4: ["biology", "chemistry", "combined-science", "maths"],
};

const NewContentBanner: FC<NewContentBannerProps> = ({
  subjectTitle,
  programmeSlug,
  keyStageSlug,
  subjectSlug,
  isUnitListing,
  isLegacy,
}) => {
  const renderComponent =
    renderContentBannerRecord[keyStageSlug]?.includes(subjectSlug);

  const [expandVideo, setExpandVideo] = useState(false);

  let navigationPage: OakPageType = "unit-index";
  let progSlug = removeLegacySlugSuffix(programmeSlug);
  let subjTitle = subjectTitle;

  if (
    keyStageSlug === "ks4" &&
    (subjectSlug === "combined-science" ||
      subjectSlug === "biology" ||
      subjectSlug === "chemistry" ||
      subjectSlug === "maths")
  ) {
    navigationPage = "programme-index";
  }

  if (subjectSlug === "english") {
    subjTitle = "English";
  }

  if (
    keyStageSlug === "ks2" &&
    (subjectSlug === "english-reading-for-pleasure" ||
      subjectSlug === "english-spelling" ||
      subjectSlug === "english-grammar")
  ) {
    progSlug = "english-primary-ks2";
    subjTitle = "English";
  }

  if (
    !renderComponent ||
    (isUnitListing && subjectSlug === "maths") ||
    !isLegacy
  ) {
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
      $flexDirection={["column-reverse", "row"]}
      $alignItems={"center"}
      $justifyContent={"space-between"}
      $mv={"space-between-m"}
      $borderColor={"grey40"}
      $dropShadow={"drop-shadow-grey"}
      $borderRadius={"border-radius-m2"}
      $gap={"space-between-m2"}
      $pa={"inner-padding-xl"}
    >
      <OakFlex $flexDirection={"column"} $gap={"space-between-xs"}>
        <OakHeading tag="h2" $font={"heading-5"}>
          Switch to our new {subjTitle} teaching resources
        </OakHeading>
        <OakP $font={"heading-light-7"}>
          Slide decks, worksheets, quizzes and lesson planning guidance designed
          for your classroom.
        </OakP>
        <OakTertiaryButton
          iconName={"chevron-right"}
          isTrailingIcon
          element="a"
          href={resolveHref}
        >
          Go to {subjTitle} resources
        </OakTertiaryButton>
      </OakFlex>
      <StyledVideoPlayerFlex
        onClick={() => setExpandVideo(!expandVideo)}
        $mb={"space-between-m"}
        $display={"block"}
        $justifyContent={"center"}
        $width={
          expandVideo
            ? ["all-spacing-19", "all-spacing-21"]
            : ["all-spacing-19"]
        }
        $alignSelf={["flex-start", "center"]}
        $gap={"space-between-l"}
        expand={expandVideo}
      >
        <VideoPlayer
          playbackId={videoPlaybackID}
          playbackPolicy={"public"}
          title={"Oak Promo Video"}
          location={"marketing"}
          isLegacy={false}
          thumbnailTime={30.8}
        />
        <OakP $font={"body-3-bold"}>Play new resources video</OakP>
      </StyledVideoPlayerFlex>
    </StyledOakFlex>
  );
};

export default NewContentBanner;
