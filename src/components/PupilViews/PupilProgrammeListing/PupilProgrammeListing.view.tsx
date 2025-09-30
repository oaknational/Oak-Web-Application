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
import {
  BrowseFactorSelector,
  Factors,
} from "@/components/PupilComponents/BrowseFactorSelector";
import { resolveOakHref } from "@/common-lib/urls";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import SignpostTeachersInlineBanner from "@/components/PupilComponents/SignpostTeachersInlineBanner/SignpostTeachersInlineBanner";
import { FactorData } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";
import { getFactorDataFromSlug } from "@/pages-helpers/pupil/options-pages/getFactorDataFromSlug";
import useAnalytics from "@/context/Analytics/useAnalytics";

export type PupilViewsProgrammeListingProps = {
  programmes: PupilProgrammeListingData[];
  baseSlug: string;
  yearSlug: PupilProgrammeListingData["yearSlug"];
  examboardSlug?: PupilProgrammeListingData["programmeFields"]["examboardSlug"];
  examboards: FactorData[];
  tiers: FactorData[];
  pathwaySlug?: PupilProgrammeListingData["programmeFields"]["pathwaySlug"];
  pathways: FactorData[];
};

export const PupilViewsProgrammeListing = ({
  programmes,
  baseSlug,
  yearSlug,
  examboardSlug,
  examboards,
  tiers,
  pathwaySlug,
  pathways,
}: PupilViewsProgrammeListingProps) => {
  const { track } = useAnalytics();

  const setFocusAfterClose = () => {
    const topNavButton = document.getElementById("top-nav-button");
    if (topNavButton) {
      topNavButton.focus();
    }
  };
  const orderedFactors: ("pathway" | "examboard" | "tier")[] = [
    "pathway",
    "examboard",
    "tier",
  ];

  const [chosenFactors, setChosenFactors] = useState<Factors>({
    pathway:
      pathwaySlug && pathways.length >= 1
        ? getFactorDataFromSlug({
            factorSlug: pathwaySlug,
            availableFactors: pathways,
          })
        : null,
    examboard:
      examboardSlug && examboards.length >= 1
        ? getFactorDataFromSlug({
            factorSlug: examboardSlug,
            availableFactors: examboards,
          })
        : null,
    tier: null,
  });

  const allFactors = {
    pathway: pathways,
    examboard: examboards,
    tier: tiers,
  };

  const availableFactors = orderedFactors.filter(
    (f) =>
      (f === "pathway" && pathways.length >= 1) ||
      (f === "tier" && tiers.length >= 1) ||
      (f === "examboard" && examboards.length >= 1),
  );

  const currentFactor =
    availableFactors.filter(
      (f) =>
        (f === "pathway" && chosenFactors.pathway === null) ||
        (f === "examboard" && chosenFactors.examboard === null) ||
        (f === "tier" && chosenFactors.tier === null),
    )[0] || "none";

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
    const currentIndex =
      currentFactor !== "none" ? availableFactors.indexOf(currentFactor) : -1;
    const prevIndex = currentIndex - 1;
    const option = availableFactors[prevIndex] || "none";

    switch (option) {
      case "examboard":
      case "tier":
      case "pathway":
        return (
          <OakTertiaryButton
            id="top-nav-button"
            iconName="arrow-left"
            onClick={() =>
              setChosenFactors({ ...chosenFactors, [option]: null })
            }
          >
            Change {option}
          </OakTertiaryButton>
        );
      default:
        return (
          <OakTertiaryButton
            id="top-nav-button"
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

  orderedFactors.forEach((f) => {
    if (chosenFactors[f]?.factor) {
      breadcrumbs.push(chosenFactors[f].factor);
    }
  });

  const BrowseOptions = () => {
    if (currentFactor === "none") {
      return <OakBox>No programme factors to be selected</OakBox>;
    }

    if (currentFactor) {
      return (
        <BrowseFactorSelector
          factorType={currentFactor}
          factors={allFactors[currentFactor]}
          baseSlug={baseSlug}
          chosenFactors={chosenFactors}
          programmes={programmes}
          onClick={(f) => {
            setChosenFactors({
              ...chosenFactors,
              [currentFactor]: f,
            });
          }}
          onTrackingCallback={(f) => {
            const activeFilters: {
              yearDescriptions: string;
              subjectDescription: string;
              examboard?: string;
            } = {
              yearDescriptions,
              subjectDescription,
            };
            if (chosenFactors["examboard"]) {
              activeFilters.examboard =
                chosenFactors["examboard"].factor || undefined;
            }
            track.browseRefined({
              platform: "owa",
              product: "pupil lesson activities",
              engagementIntent: "use",
              eventVersion: "2.0.0",
              componentType: "programme_card",
              analyticsUseCase: "Pupil",
              filterType: "Exam board / tier filter",
              filterValue:
                {
                  ...chosenFactors,
                  [currentFactor]: f,
                }[currentFactor]?.factor || "",
              activeFilters,
            });
          }}
          phaseSlug={phaseSlug}
        />
      );
    }

    return <OakBox>No programme factors to be selected</OakBox>;
  };

  const optionTitles = (): { hint: string; title: string } => {
    switch (currentFactor) {
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
          noIndex: true,
          noFollow: false,
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
            <SignpostTeachersInlineBanner onCallBack={setFocusAfterClose} />
          </OakBox>
        </OakPupilJourneyLayout>
      </AppLayout>
    </OakThemeProvider>
  );
};
