import { useState } from "react";
import {
  OakPupilJourneyLayout,
  OakTertiaryButton,
  OakPupilJourneyHeader,
  OakBox,
} from "@oaknational/oak-components";

import { UseBackHrefProps, useBackHref } from "./useBackHref";

import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";
import SignpostTeachersInlineBanner from "@/components/PupilComponents/SignpostTeachersInlineBanner/SignpostTeachersInlineBanner";
import { PupilUnitsSection } from "@/components/PupilComponents/PupilUnitsSection";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { generateKeyStageTitle } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import { SubjectSlugs } from "@/node-lib/curriculum-api-2023/queries/pupilSubjectListing/pupilSubjectListing.schema";
import RelatedSubjectsBanner from "@/components/PupilComponents/RelatedSubjectsBanner/RelatedSubjectsBanner";
import PupilSubjectDescription from "@/components/PupilComponents/PupilSubjectDescription/PupilSubjectDescription";
import { UnitListLegacyBanner } from "@/components/TeacherComponents/UnitList/UnitListLegacyBanner";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export type PupilViewsUnitListingProps = {
  unitSections: UnitsSectionData[];
  phase: "primary" | "secondary";
  backHrefSlugs: UseBackHrefProps;
  subjectCategories: string[];
  programmeFields: UnitListingBrowseData[number]["programmeFields"];
  relatedSubjects?: SubjectSlugs[];
};

export const PupilViewsUnitListing = ({
  unitSections,
  phase,
  backHrefSlugs,
  subjectCategories,
  programmeFields,
  relatedSubjects = [],
}: PupilViewsUnitListingProps) => {
  const { track } = useAnalytics();
  const [backHref, backLabel] = useBackHref(backHrefSlugs);

  const [filterItems, setFilterItems] = useState<string[]>(["All"]);

  const applyFilter = (subjectCategory: string) => {
    setFilterItems([subjectCategory]);
  };

  const combinedAllUnits = unitSections.flatMap((section) =>
    section.units.flat(),
  );

  const hasNewAndLegacyUnitsInAllSections =
    combinedAllUnits.some((u) => isSlugLegacy(u.programmeSlug)) &&
    combinedAllUnits.some((u) => !isSlugLegacy(u.programmeSlug));

  return (
    <OakPupilJourneyLayout
      phase={phase}
      sectionName="unit-listing"
      topNavSlot={
        <OakTertiaryButton element="a" href={backHref} iconName="arrow-left">
          {backLabel}
        </OakTertiaryButton>
      }
    >
      <OakBox $mb={"space-between-m2"}>
        {unitSections.map((unitSection, i) => {
          let subjectLabel = unitSection.labels?.subject;
          if (
            unitSection.labels?.subject &&
            unitSections[1]?.labels?.subject &&
            filterItems[0] !== undefined &&
            filterItems[0] !== "All"
          ) {
            subjectLabel = filterItems[0];
          }

          const labelsArray = [
            unitSection.labels?.year,
            subjectLabel,
            unitSection.labels?.tier,
          ].filter((label): label is string => Boolean(label));

          return (
            <PupilUnitsSection
              key={unitSection.title}
              titleSlot={
                unitSection.title && unitSection.icon ? (
                  <OakPupilJourneyHeader
                    title={unitSection.title}
                    iconName={unitSection.icon}
                    iconBackground={phase}
                    breadcrumbs={unitSection.breadcrumbs}
                  />
                ) : null
              }
              subjectCategories={subjectCategories}
              filterItems={filterItems}
              applyFilter={applyFilter}
              phase={phase}
              units={unitSection.units}
              counterText={unitSection.counterText}
              counterLength={unitSection.counterLength}
              labels={labelsArray.length ? labelsArray : undefined}
              showTooltip={i === 0}
              additionalInfoSlot={
                <>
                  <PupilSubjectDescription programmeFields={programmeFields} />
                  <UnitListLegacyBanner
                    userType={"pupil"}
                    hasNewUnits={hasNewAndLegacyUnitsInAllSections}
                    allLegacyUnits={unitSection.units}
                  />
                </>
              }
              id={`section-${i}`}
              onUnitSelected={(unit) => {
                track.unitAccessed({
                  platform: "owa",
                  product: "pupil lesson activities",
                  engagementIntent: "use",
                  eventVersion: "2.0.0",
                  componentType: "programme_card",
                  analyticsUseCase: "Pupil",
                  unitName: unit.unitData.title,
                  unitSlug: unit.unitData.slug,
                  subjectTitle: programmeFields.subject,
                  subjectSlug: programmeFields.subjectSlug,
                  yearGroupName: programmeFields.year,
                  yearGroupSlug: programmeFields.yearSlug,
                  keyStageTitle: generateKeyStageTitle(
                    programmeFields.keystageDescription,
                  ),
                  keyStageSlug: programmeFields.keystageSlug,
                  tierName: unit.programmeFields.tierDescription,
                  examBoard: unit.programmeFields.examboard,
                });
              }}
            />
          );
        })}
        {relatedSubjects.map((subjectSlug) => (
          <RelatedSubjectsBanner
            key={subjectSlug}
            subjectSlug={subjectSlug}
            programmeFields={programmeFields}
          />
        ))}
        <OakBox $mt={"space-between-m2"}>
          <SignpostTeachersInlineBanner />
        </OakBox>
      </OakBox>
    </OakPupilJourneyLayout>
  );
};
