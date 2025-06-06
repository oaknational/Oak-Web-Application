import React, { FC, useState, useEffect } from "react";
import {
  OakFieldset,
  OakFilterDrawer,
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import UnitsLearningThemeFilters from "../UnitsLearningThemeFilters/UnitsLearningThemeFilters";

import YearGroupFilters from "@/components/TeacherComponents/YearGroupFilters";
import SubjectCategoryFilters from "@/components/TeacherComponents/SubjectCategoryFilters";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import filterUnits from "@/utils/filterUnits/filterUnits";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { SpecialistUnitListingData } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";

export type MobileUnitFiltersProps = {
  numberOfUnits: number;
  browseRefined: TrackFns["browseRefined"];
  setSelectedThemeSlug: (theme: string | undefined) => void;
  learningThemesFilterId: string;
  isSpecialist?: boolean;
  yearGroups: UnitListingData["yearGroups"];
} & (UnitListingData | SpecialistUnitListingData);

// Type guard as due to differences in specialist and non-specialist unit listing data
function isUnitListingData(
  data: UnitListingData | SpecialistUnitListingData,
): data is UnitListingData {
  return (data as UnitListingData).yearGroups !== undefined;
}

const MobileUnitFilters: FC<MobileUnitFiltersProps> = (props) => {
  const {
    learningThemes,
    numberOfUnits,
    programmeSlug,
    browseRefined,
    setSelectedThemeSlug,
    learningThemesFilterId,
    subjectTitle,
    subjectSlug,
    units,
    isSpecialist,
    yearGroups,
  } = props;
  const isUnitListing = isUnitListingData(props);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [year, setYear] = useState(router.query["year"]?.toString() ?? "");
  const [category, setCategory] = useState<string>(
    router.query["category"]?.toString() ?? "",
  );
  const [theme, setTheme] = useState<string | undefined>(
    router.query["learning-theme"]?.toString() ?? "",
  );
  const [currNumberOfUnits, setCurrNumberOfUnits] = useState(numberOfUnits);

  useEffect(() => {
    const inputTheme = theme === "all" ? undefined : theme;

    if (isUnitListing) {
      const filteredUnits = filterUnits({
        themeSlug: inputTheme,
        categorySlug: category,
        yearGroup: year,
        units: units as UnitListingData["units"],
      });
      setCurrNumberOfUnits(filteredUnits.length);
    } else {
      const filteredUnits = filterUnits({
        themeSlug: inputTheme,
        categorySlug: category,
        yearGroup: year,
        units: units as SpecialistUnitListingData["units"],
      });
      setCurrNumberOfUnits(filteredUnits.length);
    }
  }, [year, category, theme, units, isUnitListing]);

  const handleClearAllFilters = () => {
    setYear("");
    setCategory("");
    setTheme(undefined);
  };

  const handleSubmitButton = () => {
    if (isUnitListing) {
      browseRefined({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "refine",
        componentType: "filter_link",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        filterValue: "show results button",
        filterType: "Subject filter",
        activeFilters: {
          content_types: "units",
          learning_themes: theme,
          categories: category,
          year: year,
        },
      });
    }
    router.replace({
      pathname: router.pathname,
      query: {
        ...(year && { year: year }),
        programmeSlug,
        ...(category && { category: category }),
        ...(theme && { "learning-theme": theme }),
      },
    });
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setYear(router.query["year"]?.toString() ?? "");
    setCategory(router.query["category"]?.toString() ?? "");
    setTheme(router.query["learning-theme"]?.toString() ?? "");
  };
  return (
    <>
      <OakTertiaryButton
        isTrailingIcon
        iconName="filter"
        onClick={() => setIsOpen(true)}
      >
        Filter
      </OakTertiaryButton>
      <OakFilterDrawer
        isOpen={isOpen}
        onClose={() => handleClose()}
        clearAllInputs={() => handleClearAllFilters()}
        footerSlot={
          <OakFlex $width={"100%"} $alignSelf={"center"}>
            <OakPrimaryButton onClick={handleSubmitButton}>
              {`Show results (${currNumberOfUnits})`}
            </OakPrimaryButton>
          </OakFlex>
        }
      >
        <OakFieldset>
          {isUnitListing && props.yearGroups.length > 1 && (
            <YearGroupFilters
              idSuffix="mobile"
              programmeSlug={programmeSlug}
              yearGroups={yearGroups}
              browseRefined={browseRefined}
              activeMobileFilter={year}
              setYear={setYear}
            />
          )}
          {isUnitListing && props.subjectCategories.length > 1 && (
            <SubjectCategoryFilters
              idSuffix="mobile"
              programmeSlug={programmeSlug}
              subjectCategories={props.subjectCategories}
              categorySlug={category}
              browseRefined={browseRefined}
              setCategory={setCategory}
              activeMobileFilter={category}
            />
          )}
          {learningThemes.length > 1 && (
            <>
              <OakHeading tag="h3" $font="heading-7" $mb={"space-between-m"}>
                Threads
              </OakHeading>

              <UnitsLearningThemeFilters
                idSuffix="mobile"
                programmeSlug={programmeSlug}
                onChangeCallback={setSelectedThemeSlug}
                labelledBy={learningThemesFilterId}
                learningThemes={learningThemes}
                selectedThemeSlug={theme ?? "all"}
                linkProps={
                  !isSpecialist
                    ? {
                        page: "unit-index",
                        programmeSlug,
                      }
                    : {
                        page: "specialist-unit-index",
                        programmeSlug: programmeSlug,
                      }
                }
                trackingProps={
                  isUnitListing && !isSpecialist
                    ? {
                        keyStageSlug: props.keyStageSlug,
                        keyStageTitle:
                          props.keyStageTitle as KeyStageTitleValueType,
                        subjectTitle,
                        subjectSlug,
                      }
                    : undefined
                }
                setMobileFilter={setTheme}
                activeMobileFilter={theme}
                browseRefined={browseRefined}
              />
            </>
          )}
        </OakFieldset>
      </OakFilterDrawer>
    </>
  );
};

export default MobileUnitFilters;
