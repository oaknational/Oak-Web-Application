import { UnitListingLinkProps } from "../../../common-lib/urls";
import CategoryFilterList from "../CategoryFilterList";
import useCategoryFilterList from "../CategoryFilterList/useCategoryFilterList";

type LearningThemeFiltersProps = {
  labelledBy: string;
  selectedThemeSlug: string;
  learningThemes: { label: string; slug: string | null }[];
};
const LearningThemeFilters = ({
  labelledBy,
  learningThemes,
  selectedThemeSlug,
}: LearningThemeFiltersProps) => {
  const listStateProps = useCategoryFilterList({
    selectedKey: selectedThemeSlug,
    getKey: (linkProps: UnitListingLinkProps) =>
      linkProps.search?.["learning-theme"],
  });
  return (
    <CategoryFilterList
      {...listStateProps}
      labelledBy={labelledBy}
      categories={learningThemes.map(({ slug, label }) => ({
        label,
        linkProps: {
          page: "unit-listing",
          search: { ["learning-theme"]: slug },
        },
      }))}
    />
  );
};

export default LearningThemeFilters;
