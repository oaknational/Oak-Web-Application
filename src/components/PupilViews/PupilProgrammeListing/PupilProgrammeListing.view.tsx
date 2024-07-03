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
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

export type PupilViewsProgrammeListingProps = {
  programmes: PupilProgrammeListingData[];
  baseSlug: string;
  yearSlug: PupilProgrammeListingData["yearSlug"];
  examboardSlug?: ExamboardData["examboardSlug"];
  examboards: ExamboardData[];
  tiers: TierData[];
};

export const PupilViewsProgrammeListing = ({
  programmes,
  baseSlug,
  yearSlug,
  examboardSlug,
  examboards,
  tiers,
}: PupilViewsProgrammeListingProps) => {
  const [chosenExamboard, setChosenExamboard] = useState<ExamboardData | null>(
    examboardSlug && examboards.length >= 1
      ? getExamboardData({ examboardSlug, availableExamboards: examboards })
      : null,
  );

  if (!programmes[0]) {
    throw new Error("No programme data available");
  }
  const firstProgrammeFields = programmes[0].programmeFields;
  const { phaseSlug } = firstProgrammeFields;

  if (phaseSlug === "foundation") {
    throw new Error("Foundation phase is not supported");
  }

  const subjectSlug = programmes[0]?.programmeFields.subjectSlug;
  const subjectDescription = programmes[0]?.programmeFields.subject;
  const yearDescriptions = programmes[0]?.programmeFields.yearDescription;

  const topNavSlot = () => {
    if (chosenExamboard !== null && tiers.length > 1) {
      return (
        <OakTertiaryButton
          iconName="arrow-left"
          onClick={() => setChosenExamboard(null)}
        >
          Change examboard
        </OakTertiaryButton>
      );
    } else {
      return (
        <OakTertiaryButton
          iconName="arrow-left"
          element="a"
          href={resolveOakHref({
            page: "pupil-subject-index",
            yearSlug,
          })}
        >
          Change subject
        </OakTertiaryButton>
      );
    }
  };

  const breadcrumbs: string[] = [yearDescriptions];
  if (chosenExamboard?.examboard && tiers.length > 1) {
    breadcrumbs.push(chosenExamboard.examboard);
  }

  const BrowseOptions = () => {
    if (
      (chosenExamboard !== null && tiers.length > 1) ||
      (examboards.length <= 1 && tiers.length >= 1)
    ) {
      return (
        <BrowseTierSelector
          tiers={tiers}
          baseSlug={baseSlug}
          examboardSlug={
            chosenExamboard ? chosenExamboard.examboardSlug : undefined
          }
          phaseSlug={phaseSlug}
        />
      );
    } else if (examboards.length > 1 && chosenExamboard === null) {
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
    } else {
      return <OakBox>No programme factors to be selected</OakBox>;
    }
  };

  const optionTitles = (): { hint: string; title: string } => {
    if (examboards.length > 1 && chosenExamboard === null) {
      return {
        hint: "An exam board sets and assesses what you learn in your GCSE course. If you can't find your exam board here or are not sure which exam board you are studying, ask your teacher.",
        title: "Choose an exam board",
      };
    }
    return {
      hint: "Some GCSE subjects have a foundation and higher tier. Different content may be covered in each tier so it is important to check with your teacher if you are unsure which tier you are doing.",
      title: "Choose a tier",
    };
  };

  const optionTitleSlot = (
    <OakFlex $alignItems={"center"} $gap={"space-between-xs"}>
      <OakInfo
        id="option-info"
        tooltipPosition="top-left"
        hint={optionTitles().hint}
      />
      <OakHeading $font={["heading-6", "heading-5"]} tag="h2">
        {optionTitles().title}
      </OakHeading>
    </OakFlex>
  );

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: `${subjectDescription}, ${phaseSlug}, ${yearDescriptions} - Programme listing`,
            description: `Programme listing for ${subjectDescription}, ${phaseSlug}, ${yearDescriptions}`,
          }),
        }}
      >
        {" "}
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
                  breadcrumbs={breadcrumbs}
                />
              }
            >
              <BrowseOptions />
            </OakPupilJourneyProgrammeOptions>
          </OakBox>
        </OakPupilJourneyLayout>
      </AppLayout>
    </OakThemeProvider>
  );
};
