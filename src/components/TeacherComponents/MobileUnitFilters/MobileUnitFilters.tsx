import React, { FC, useState, useEffect } from "react";
import {
  OakBox,
  OakFieldset,
  OakFilterDrawer,
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import UnitsLearningThemeFilters from "../UnitsLearningThemeFilters/UnitsLearningThemeFilters";

import YearGroupFilters from "@/components/TeacherComponents/YearGroupFilters";
import SubjectCategoryFilters from "@/components/TeacherComponents/SubjectCategoryFilters";
import filterUnits from "@/utils/filterUnits/filterUnits";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { SpecialistUnitListingData } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import { FilterQuery } from "@/hooks/useUnitFilterState";

export type MobileUnitFiltersProps = {
  numberOfUnits: number;
  learningThemesFilterId: string;
  updateActiveFilters: (queryObj: FilterQuery | null) => void;
  newFilterQuery: FilterQuery | null;
  currentFilterQuery: FilterQuery | null;
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

const MobileUnitFilters: FC<MobileUnitFiltersProps> = (props) => {
  const {
    learningThemes,
    numberOfUnits,
    learningThemesFilterId,
    units,
    newFilterQuery,
    currentFilterQuery,
    updateActiveFilters,
    isOpen,
    setIsOpen,
    handleSubmitQuery,
  } = props;
  const isUnitListing = isUnitListingData(props);

  const year = newFilterQuery?.year ?? currentFilterQuery?.year ?? "";
  const category =
    newFilterQuery?.category ?? currentFilterQuery?.category ?? "";
  const theme = newFilterQuery?.theme ?? currentFilterQuery?.theme ?? "all";

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
  }, [category, theme, year, units, isUnitListing]);

  return (
    <OakBox $display={["auto", "auto", "none"]}>
      <OakTertiaryButton
        isTrailingIcon
        iconName="filter"
        onClick={() => setIsOpen(true)}
      >
        Filter
      </OakTertiaryButton>
      <OakFilterDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        clearAllInputs={() => updateActiveFilters(null)}
        footerSlot={
          <OakFlex $width={"100%"} $alignSelf={"center"}>
            <OakPrimaryButton onClick={handleSubmitQuery}>
              {`Show results (${currNumberOfUnits})`}
            </OakPrimaryButton>
          </OakFlex>
        }
      >
        <OakFieldset>
          {isUnitListing && props.yearGroups.length > 1 && (
            <YearGroupFilters
              idSuffix="mobile"
              yearGroups={props.yearGroups}
              yearGroupSlug={year}
              setYear={(year) => updateActiveFilters({ year })}
            />
          )}
          {isUnitListing && props.subjectCategories.length > 1 && (
            <SubjectCategoryFilters
              idSuffix="mobile"
              subjectCategories={props.subjectCategories}
              categorySlug={category}
              setCategory={(category) => updateActiveFilters({ category })}
            />
          )}
          {learningThemes.length > 1 && (
            <>
              <OakHeading tag="h3" $font="heading-7" $mb={"space-between-m"}>
                Threads
              </OakHeading>

              <UnitsLearningThemeFilters
                idSuffix="mobile"
                labelledBy={learningThemesFilterId}
                learningThemes={learningThemes}
                selectedThemeSlug={theme ?? "all"}
                setTheme={(theme) => updateActiveFilters({ theme })}
              />
            </>
          )}
        </OakFieldset>
      </OakFilterDrawer>
    </OakBox>
  );
};

export default MobileUnitFilters;
