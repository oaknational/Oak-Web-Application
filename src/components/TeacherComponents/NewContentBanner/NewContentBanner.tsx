import React, { FC } from "react";
import styled from "styled-components";
import { OakFlex } from "@oaknational/oak-components";

import PromoBannerWithVideo from "../PromoBannerWithVideo";

import removeLegacySlugSuffix from "@/utils/slugModifiers/removeLegacySlugSuffix";
import { resolveOakHref, OakPageType } from "@/common-lib/urls";

export const StyledVideoFlex = styled(OakFlex)<{ expand: boolean }>`
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
    <PromoBannerWithVideo
      title={`Switch to our new ${subjTitle} teaching resources`}
      text={`Slide decks, worksheets, quizzes and lesson planning guidance designed
          for your classroom.`}
      buttonText={`Go to ${subjTitle} resources`}
      buttonIconName="chevron-right"
      href={resolveHref}
      videoPlaybackID={videoPlaybackID}
    />
  );
};

export default NewContentBanner;
