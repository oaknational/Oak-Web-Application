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
  isValidIconName,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { BrowseExamboardSelector } from "@/components/PupilComponents/BrowseExamboardSelector";
import { BrowseTierSelector } from "@/components/PupilComponents/BrowseTierSelector";
import { resolveOakHref } from "@/common-lib/urls";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import SignpostTeachersInlineBanner from "@/components/PupilComponents/SignpostTeachersInlineBanner/SignpostTeachersInlineBanner";
import { BrowsePathwaySelector } from "@/components/PupilComponents/BrowsePathwaySelector";
import {
  ExamboardData,
  PathwayData,
  TierData,
} from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";
import { getExamboardData } from "@/pages-helpers/pupil/options-pages/getExamboardData";

export type PupilViewsProgrammeListingProps = {
  programmes: PupilProgrammeListingData[];
  baseSlug: string;
  yearSlug: PupilProgrammeListingData["yearSlug"];
  examboardSlug?: ExamboardData["examboardSlug"];
  examboards: ExamboardData[];
  tiers: TierData[];
  pathways: PathwayData[];
};

export const PupilViewsProgrammeListing = ({
  programmes,
  baseSlug,
  yearSlug,
  examboardSlug,
  examboards,
  tiers,
  pathways,
}: PupilViewsProgrammeListingProps) => {
  const [chosenExamboard, setChosenExamboard] = useState<ExamboardData | null>(
    examboardSlug && examboards.length >= 1
      ? getExamboardData({ examboardSlug, availableExamboards: examboards })
      : null,
  );

  const [chosenTier, setChosenTier] = useState<TierData | null>(null); // TODO: this potentially might be set from a slug in future
  const [chosenPathway, setChosenPathway] = useState<PathwayData | null>(null);

  // TODO: recalculate examboards, tiers, pathways based on chosenExamboard, chosenTier, chosenPathway - this way we avoid offering options which don't exist

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
    const current = getCurrentOption();
    const options = ["pathway", "examboard", "tier"].filter(
      (f) =>
        (f === "pathway" && pathways.length > 1) ||
        (f === "tier" && tiers.length > 1) ||
        (f === "examboard" && examboards.length > 1),
    );
    const currentIndex = options.indexOf(current);
    const prevIndex = currentIndex - 1;
    const option = options[prevIndex] || "none";

    switch (option) {
      case "examboard":
        return (
          <OakTertiaryButton
            iconName="arrow-left"
            onClick={() => setChosenExamboard(null)}
          >
            Change examboard
          </OakTertiaryButton>
        );

      case "tier":
        return (
          <OakTertiaryButton
            iconName="arrow-left"
            onClick={() => setChosenTier(null)}
          >
            Change tier
          </OakTertiaryButton>
        );
      case "pathway":
        return (
          <OakTertiaryButton
            iconName="arrow-left"
            onClick={() => setChosenPathway(null)}
          >
            Change pathway
          </OakTertiaryButton>
        );
      default:
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

  const getCurrentOption = () => {
    const options = [];
    if (pathways.length > 1 && chosenPathway === null) {
      options.push("pathway");
    }
    if (examboards.length > 1 && chosenExamboard === null) {
      options.push("examboard");
    }
    if (tiers.length > 1 && chosenTier === null) {
      options.push("tier");
    }

    return options[0] || "none";
  };

  const BrowseOptions = () => {
    switch (getCurrentOption()) {
      case "pathway":
        return (
          <BrowsePathwaySelector
            pathways={pathways}
            onClick={setChosenPathway}
            phaseSlug={phaseSlug}
          />
        );
      case "tier":
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
      case "examboard":
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
        return <OakBox>No programme factors to be selected</OakBox>;
    }
  };

  const optionTitles = (): { hint: string; title: string } => {
    switch (getCurrentOption()) {
      case "pathway":
        return {
          hint: "A pathway is either examined or non-examined",
          title: "Choose a pathway",
        };
      case "examboard":
        return {
          hint: "An exam board sets and assesses what you learn in your GCSE course. If you can't find your exam board here or are not sure which exam board you are studying, ask your teacher.",
          title: "Choose an exam board",
        };
      case "tier":
        return {
          hint: "Some GCSE subjects have a foundation and higher tier. Different content may be covered in each tier so it is important to check with your teacher if you are unsure which tier you are doing.",
          title: "Choose a tier",
        };
      default:
        return {
          hint: "",
          title: "No programme factors to be selected",
        };
    }
  };

  const iconSlug = `subject-${subjectSlug}`;

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
          <OakBox $mb={"space-between-m2"}>
            <OakBox $mb={"space-between-m2"}>
              <OakPupilJourneyProgrammeOptions
                optionTitleSlot={optionTitleSlot}
                phase={phaseSlug}
                titleSlot={
                  <OakPupilJourneyHeader
                    iconBackground={phaseSlug}
                    iconName={
                      isValidIconName(iconSlug) ? iconSlug : "question-mark"
                    }
                    title={subjectDescription}
                    breadcrumbs={breadcrumbs}
                  />
                }
              >
                <BrowseOptions />
              </OakPupilJourneyProgrammeOptions>
            </OakBox>
            <SignpostTeachersInlineBanner />
          </OakBox>
        </OakPupilJourneyLayout>
      </AppLayout>
    </OakThemeProvider>
  );
};
