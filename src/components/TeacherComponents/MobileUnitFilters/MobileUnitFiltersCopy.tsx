import React, { FC, useState, useEffect, useMemo } from "react";
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
import { setYear } from "date-fns";
import { year } from "drizzle-orm/mysql-core";
import { FilterQuery } from "@/pages/teachers/programmes/[programmeSlug]/units";

export type MobileUnitFiltersProps = {
  numberOfUnits: number;
  browseRefined: TrackFns["browseRefined"];
  learningThemesFilterId: string;
  isSpecialist?: boolean;
  updateQuery: (queryObj: FilterQuery | null) => void;
  newQuery: FilterQuery | null;
  currentQuery: FilterQuery | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitQuery: () => void;
} & (UnitListingData | SpecialistUnitListingData);

// Type guard as due to differences in specialist and non-specialist unit listing data
function isUnitListingData(
  data: UnitListingData | SpecialistUnitListingData,
): data is UnitListingData {
  return (data as UnitListingData).yearGroups !== undefined;
}

const MobileUnitFiltersCopy: FC<MobileUnitFiltersProps> = (props) => {
  const {
    learningThemes,
    numberOfUnits,
    programmeSlug,
    browseRefined,
    learningThemesFilterId,
    subjectTitle,
    subjectSlug,
    units,
    isSpecialist,
    newQuery,
    currentQuery,
    updateQuery: setQuery,
    isOpen,
    setIsOpen,
    handleSubmitQuery,
  } = props;
  const isUnitListing = isUnitListingData(props);

  const year = newQuery?.year ?? currentQuery?.year ?? "";
  const category = newQuery?.category ?? currentQuery?.category ?? "";
  const theme = newQuery?.theme ?? currentQuery?.theme ?? "all";

  // const [currNumberOfUnits, setCurrNumberOfUnits] = useState(numberOfUnits);

  useEffect(() => {
    // TODO: get length of filtered units
    // const inputTheme = theme === "all" ? undefined : theme;
    // if (isUnitListing) {
    //   const filteredUnits = filterUnits({
    //     themeSlug: inputTheme,
    //     categorySlug: category,
    //     yearGroup: year,
    //     units: units as UnitListingData["units"],
    //   });
    //   setCurrNumberOfUnits(filteredUnits.length);
    // } else {
    //   const filteredUnits = filterUnits({
    //     themeSlug: inputTheme,
    //     categorySlug: category,
    //     yearGroup: year,
    //     units: units as SpecialistUnitListingData["units"],
    //   });
    //   setCurrNumberOfUnits(filteredUnits.length);
    // }
  }, []);

  const handleClearAllFilters = () => {
    setQuery(null);
  };

  const handleSubmitButton = () => {
    // if (isUnitListing) {
    //   browseRefined({
    //     platform: "owa",
    //     product: "teacher lesson resources",
    //     engagementIntent: "refine",
    //     componentType: "filter_link",
    //     eventVersion: "2.0.0",
    //     analyticsUseCase: "Teacher",
    //     filterValue: "show results button",
    //     filterType: "Subject filter",
    //     activeFilters: {
    //       content_types: "units",
    //       learning_themes: theme,
    //       categories: category,
    //       year: year,
    //     },
    //   });
    // }

    handleSubmitQuery();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
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
              {`Show results (TODO: number of units)`}
            </OakPrimaryButton>
          </OakFlex>
        }
      >
        <OakFieldset>
          {isUnitListing && props.yearGroups.length > 1 && (
            <YearGroupFilters
              idSuffix="mobile"
              programmeSlug={programmeSlug}
              yearGroups={props.yearGroups}
              browseRefined={browseRefined}
              activeMobileFilter={year}
              setYear={(year) => setQuery({ year })}
            />
          )}
          {isUnitListing && props.subjectCategories.length > 1 && (
            <SubjectCategoryFilters
              idSuffix="mobile"
              programmeSlug={programmeSlug}
              subjectCategories={props.subjectCategories}
              categorySlug={category}
              browseRefined={browseRefined}
              setCategory={(category) => setQuery({ category })}
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
                setMobileFilter={(theme) => setQuery({ theme })}
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

export default MobileUnitFiltersCopy;
