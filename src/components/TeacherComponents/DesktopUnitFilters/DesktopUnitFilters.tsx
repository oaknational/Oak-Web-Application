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
  BrowseRefinedProperties,
  KeyStageTitleValueType,
} from "@/browser-lib/avo/Avo";
import {
  LearningThemes,
  SubjectCategory,
  YearGroups,
} from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

export type DesktopUnitFiltersProps = {
  showFilters: boolean;
  filtersRef: React.RefObject<HTMLDivElement> | null;
  onFocus: () => void;
  onBlur: () => void;
  yearGroups: YearGroups;
  subjectCategories: Array<SubjectCategory>;
  learningThemes: LearningThemes;
  skipFiltersButton: boolean;
  programmeSlug: string;
  selectedThemeSlug: string | undefined;
  categorySlug: string | undefined;
  yearGroupSlug: string | undefined;
  subjectSlug: string;
  subjectTitle: string;
  keyStageSlug: string;
  keyStageTitle: string;
  learningThemesId: string;
  browseRefined: (properties: BrowseRefinedProperties) => void;
  setSelectedThemeSlug: (themeSlug: string | undefined) => void;
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
    selectedThemeSlug,
    programmeSlug,
    setSelectedThemeSlug,
    categorySlug,
    yearGroupSlug,
    subjectSlug,
    subjectTitle,
    keyStageSlug,
    keyStageTitle,
    learningThemesId,
    browseRefined,
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
            browseRefined={browseRefined}
            selectedThemeSlug={selectedThemeSlug}
            programmeSlug={programmeSlug}
          />
        )}
        {subjectCategories && subjectCategories.length > 1 && (
          <SubjectCategoryFilters
            idSuffix="desktop"
            subjectCategories={subjectCategories}
            categorySlug={categorySlug}
            browseRefined={browseRefined}
            programmeSlug={programmeSlug}
            selectedThemeSlug={selectedThemeSlug}
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
              onChangeCallback={setSelectedThemeSlug}
              labelledBy={learningThemesId}
              learningThemes={learningThemes}
              selectedThemeSlug={selectedThemeSlug ?? "all"}
              categorySlug={categorySlug}
              yearGroupSlug={yearGroupSlug}
              programmeSlug={programmeSlug}
              linkProps={{
                page: "unit-index",
                programmeSlug,
              }}
              trackingProps={{
                keyStageSlug,
                keyStageTitle: keyStageTitle as KeyStageTitleValueType,
                subjectTitle,
                subjectSlug,
              }}
              browseRefined={browseRefined}
            />
          </OakFlex>
        )}
      </OakFieldset>
    </OakBox>
  );
};

export default DesktopUnitFilters;
