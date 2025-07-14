import {
  OakBox,
  OakFieldset,
  OakFlex,
  OakHeading,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import YearGroupFilters from "../YearGroupFilters";
import SubjectCategoryFilters from "../SubjectCategoryFilters";
import UnitsLearningThemeFilters from "../UnitsLearningThemeFilters";

import {
  LearningThemes,
  SubjectCategory,
  YearGroups,
} from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { FilterQuery } from "@/hooks/useUnitFilterState";

export type DesktopUnitFiltersProps = {
  showFilters: boolean;
  filtersRef: React.RefObject<HTMLDivElement> | null;
  onFocus: () => void;
  onBlur: () => void;
  yearGroups: YearGroups;
  subjectCategories: Array<SubjectCategory>;
  learningThemes: LearningThemes;
  skipFiltersButton: boolean;
  learningThemesId: string;
  updateQuery: (queryObj: FilterQuery | null) => void;
  incomingThemeSlug: string;
  incomingCategorySlug: string;
  incomingYearSlug: string;
};
const DesktopUnitFilters = (props: DesktopUnitFiltersProps) => {
  const {
    showFilters,
    filtersRef,
    onFocus,
    onBlur,
    yearGroups,
    subjectCategories,
    learningThemes,
    skipFiltersButton,
    learningThemesId,
    updateQuery,
    incomingThemeSlug,
    incomingCategorySlug,
    incomingYearSlug,
  } = props;

  return (
    <OakBox
      $display={["none", "none", "block"]}
      $position={[null, null, "sticky"]}
      $pt={["inner-padding-xl4"]}
      $maxWidth={"all-spacing-20"}
    >
      <OakFieldset>
        {showFilters && (
          <OakBox $mb={"space-between-m2"}>
            <OakHeading tag="h3" $font="heading-6" $mb={"space-between-ssx"}>
              Filters
            </OakHeading>

            <OakBox ref={filtersRef}>
              <OakSecondaryButton
                element="a"
                aria-label="Skip to units"
                href="#unit-list"
                onFocus={onFocus}
                onBlur={onBlur}
                style={
                  skipFiltersButton
                    ? {}
                    : {
                        position: "absolute",
                        top: "-9999px",
                        left: "-9999px",
                      }
                }
              >
                Skip to units
              </OakSecondaryButton>
            </OakBox>
          </OakBox>
        )}
        {yearGroups.length > 1 && (
          <YearGroupFilters
            yearGroups={yearGroups}
            idSuffix="desktop"
            setYear={(year) => updateQuery({ year })}
            yearGroupSlug={incomingYearSlug}
          />
        )}
        {subjectCategories && subjectCategories.length > 1 && (
          <SubjectCategoryFilters
            idSuffix="desktop"
            subjectCategories={subjectCategories}
            categorySlug={incomingCategorySlug}
            setCategory={(category) => updateQuery({ category })}
          />
        )}
        {learningThemes?.length > 1 && (
          <OakFlex $flexDirection={"column"}>
            <OakHeading
              id={learningThemesId}
              tag="h3"
              $font="heading-7"
              $mb="space-between-s"
            >
              {/* Though still called "Learning themes" internally, these should be referred to as "Threads" in user facing displays */}
              Threads
            </OakHeading>
            <UnitsLearningThemeFilters
              idSuffix="desktop"
              labelledBy={learningThemesId}
              learningThemes={learningThemes}
              selectedThemeSlug={incomingThemeSlug}
              setTheme={(theme) => updateQuery({ theme })}
            />
          </OakFlex>
        )}
      </OakFieldset>
    </OakBox>
  );
};

export default DesktopUnitFilters;
