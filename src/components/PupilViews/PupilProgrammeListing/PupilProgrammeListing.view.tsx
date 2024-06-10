import { useState } from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakInfo,
  OakPupilJourneyHeader,
  OakPupilJourneyLayout,
  OakPupilJourneyProgrammeOptions,
  OakTertiaryButton,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import _ from "lodash";

import { getAvailableProgrammeFactor } from "./getAvailableProgrammeFactor";
import { getExamboardData } from "./getExamboardData";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import {
  BrowseExamboardSelector,
  ExamboardData,
} from "@/components/PupilComponents/BrowseExamboardSelector";
import {
  BrowseTierSelector,
  TierData,
} from "@/components/PupilComponents/BrowseTierSelector";
import { resolveOakHref } from "@/common-lib/urls";

export type PupilViewsProgrammeListingProps = {
  programmes: PupilProgrammeListingData[];
  baseSlug: string;
  yearSlug: PupilProgrammeListingData["yearSlug"];
  examboardSlug?: ExamboardData["examboardSlug"];
};

export const PupilViewsProgrammeListing = ({
  programmes,
  baseSlug,
  yearSlug,
  examboardSlug,
}: PupilViewsProgrammeListingProps) => {
  const allExamboards: { [key: string]: ExamboardData[] } = _.groupBy(
    getAvailableProgrammeFactor({
      programmes,
      factorPrefix: "examboard",
    }) as ExamboardData[],
    (examboard: ExamboardData) => examboard.examboard,
  );

  // This creates an array of examboards giving preference to non-legacy examboards
  const examboards = Object.keys(allExamboards)
    .map((examboard) => {
      const mappedExamboard = allExamboards[examboard];
      if (!Array.isArray(mappedExamboard) || mappedExamboard.length < 1) return;
      return (
        allExamboards[examboard]?.find(
          (examboard: ExamboardData) => !examboard.isLegacy,
        ) || mappedExamboard[0]
      );
    })
    .filter((examboard): examboard is ExamboardData => examboard !== undefined);

  const [chosenExamboard, setChosenExamboard] = useState<ExamboardData | null>(
    examboardSlug && examboards.length >= 1
      ? getExamboardData({ examboardSlug, availableExamboards: examboards })
      : null,
  );

  const allTiers: { [key: string]: TierData[] } = _.groupBy(
    getAvailableProgrammeFactor({
      programmes: programmes,
      factorPrefix: "tier",
    }) as TierData[],
    (tier: TierData) => tier.tier,
  );

  // This creates an array of tiers giving preference to non-legacy tiers
  const tiers = Object.keys(allTiers)
    .map((tierLabel) => {
      const mappedTier = allTiers[tierLabel];
      if (!Array.isArray(mappedTier) || mappedTier.length < 1) return;
      return (
        allTiers[tierLabel]?.find((tier: TierData) => !tier.isLegacy) ||
        mappedTier[0]
      );
    })
    .filter((tier): tier is TierData => tier !== undefined);

  if (!programmes[0]) {
    throw new Error("No programme data available");
  }
  const firstProgrammeFields = programmes[0].programmeFields;
  const { phaseSlug } = firstProgrammeFields;

  if (phaseSlug === "foundation") {
    throw new Error("Foundation phase is not supported");
  }

  const backlink = resolveOakHref({
    page: "pupil-subject-index",
    yearSlug,
  });

  const subjectSlug = programmes[0]?.programmeFields.subjectSlug;
  const subjectDescription = programmes[0]?.programmeFields.subject;
  const yearDescriptions = programmes[0]?.programmeFields.yearDescription;

  // TODO - switch statement can be refactored
  const topNavSlot = () => {
    switch (true) {
      // examboard is chosen and there are multiple tiers
      case chosenExamboard !== null && tiers.length > 1:
        return (
          <OakTertiaryButton
            iconName="arrow-left"
            onClick={() => setChosenExamboard(null)}
          >
            Change examboard
          </OakTertiaryButton>
        );
      default:
        return (
          <OakTertiaryButton iconName="arrow-left" element="a" href={backlink}>
            Change subject
          </OakTertiaryButton>
        );
    }
  };

  const breadcrumbs = () => {
    if (
      !chosenExamboard ||
      tiers.length <= 1 ||
      chosenExamboard.examboard === null
    ) {
      return [yearDescriptions];
    }
    return [yearDescriptions, chosenExamboard.examboard] as string[];
  };

  // TODO - Immediate function and switch statement can be refactored
  const BrowseOptions = () => {
    return (() => {
      switch (true) {
        case (chosenExamboard !== null && tiers.length > 1) ||
          (examboards.length <= 1 && tiers.length >= 1):
          return (
            <BrowseTierSelector
              tiers={tiers as TierData[]}
              baseSlug={baseSlug}
              examboardSlug={
                chosenExamboard ? chosenExamboard.examboardSlug : undefined
              }
              phaseSlug={phaseSlug}
            />
          );
        case examboards.length > 1 && chosenExamboard === null:
          return (
            <BrowseExamboardSelector
              examboards={examboards}
              baseSlug={baseSlug}
              onClick={
                tiers.length > 1
                  ? (examboard) => setChosenExamboard(examboard)
                  : undefined
              }
              phaseSlug={phaseSlug}
            />
          );
        default:
          return <div>No programme factors to be selected</div>;
      }
    })();
  };

  // TODO - Switch statement can be refactored
  const optionTitles = (): { hint: string; title: string } => {
    switch (true) {
      case examboards.length > 1 && chosenExamboard === null:
        return {
          hint: "An exam board sets and assesses what you learn in your GCSE course. If you can't find your exam board here or are not sure which exam board you are studying, ask your teacher.",
          title: "Choose an exam board",
        };
      default:
        return {
          hint: "Some GCSE subjects have a foundation and higher tier.  Different content may be covered in each tier so it is important to check with your teacher if you are unsure which tier you are doing.",
          title: "Choose a tier",
        };
    }
  };

  const optionTitleSlot = (
    <OakFlex $alignItems={"center"} $gap={"space-between-xs"}>
      <OakInfo tooltipPosition="top-left" hint={optionTitles().hint} />
      <OakHeading $font={["heading-6", "heading-5"]} tag="h2">
        {optionTitles().title}
      </OakHeading>
    </OakFlex>
  );

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakPupilJourneyLayout
        sectionName={"tier-listing"}
        phase={phaseSlug}
        topNavSlot={topNavSlot()}
      >
        <OakBox $mb={"space-between-xxl"}>
          <OakPupilJourneyProgrammeOptions
            optionTitleSlot={optionTitleSlot}
            phase={phaseSlug}
            titleSlot={
              <OakPupilJourneyHeader
                iconBackground={phaseSlug}
                iconName={`subject-${subjectSlug}`}
                title={subjectDescription}
                breadcrumbs={breadcrumbs()}
              />
            }
          >
            <BrowseOptions />
          </OakPupilJourneyProgrammeOptions>
        </OakBox>
      </OakPupilJourneyLayout>
    </OakThemeProvider>
  );
};
