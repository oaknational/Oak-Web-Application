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

import { FilterTypeValueType } from "@/browser-lib/avo/Avo";
import {
  LearningThemes,
  SubjectCategory,
  YearGroups,
} from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { FilterQuery } from "@/pages/teachers/programmes/[programmeSlug]/units";

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
  updateQuery: (
    queryObj: FilterQuery | null,
    filterType: FilterTypeValueType,
    filterValue: string,
  ) => void;
  newQuery: FilterQuery | null;
  currentQuery: FilterQuery | null;
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
    currentQuery,
    newQuery,
    updateQuery,
  } = props;

  const yearGroupSlug = newQuery?.year ?? currentQuery?.year ?? "";
  const categorySlug = newQuery?.category ?? currentQuery?.category ?? "";
  const selectedThemeSlug = newQuery?.theme ?? currentQuery?.theme ?? "all";

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
            setYear={(year) => updateQuery({ year }, "Year filter", year ?? "")}
            yearGroupSlug={yearGroupSlug}
          />
        )}
        {subjectCategories && subjectCategories.length > 1 && (
          <SubjectCategoryFilters
            idSuffix="desktop"
            subjectCategories={subjectCategories}
            categorySlug={categorySlug}
            setCategory={(category) =>
              updateQuery({ category }, "Subject filter", category ?? "")
            }
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
              selectedThemeSlug={selectedThemeSlug ?? "all"}
              setTheme={(theme) =>
                updateQuery({ theme }, "Learning theme filter", theme ?? "all")
              }
            />
          </OakFlex>
        )}
      </OakFieldset>
    </OakBox>
  );
};

export default DesktopUnitFilters;
