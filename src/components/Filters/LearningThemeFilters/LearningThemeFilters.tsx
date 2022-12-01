import { UnitIndexLinkProps } from "../../../common-lib/urls";
import CategoryFilterList from "../CategoryFilterList";
import useCategoryFilterList from "../CategoryFilterList/useCategoryFilterList";

export type LearningThemeFiltersProps = {
  labelledBy: string;
  selectedThemeSlug: string;
  learningThemes: { label: string; slug: string | null }[];
  linkProps: UnitIndexLinkProps;
};
const LearningThemeFilters = ({
  labelledBy,
  learningThemes,
  selectedThemeSlug,
  linkProps,
}: LearningThemeFiltersProps) => {
  const listStateProps = useCategoryFilterList({
    selectedKey: selectedThemeSlug,
    getKey: (linkProps: UnitIndexLinkProps) =>
      linkProps.search?.["learning-theme"],
  });
  return (
    <CategoryFilterList
      {...listStateProps}
      labelledBy={labelledBy}
      categories={learningThemes.map(({ slug, label }) => ({
        label,
        linkProps: {
          ...linkProps,
          search: { ...linkProps.search, ["learning-theme"]: slug },
        },
      }))}
    />
  );
};

export default LearningThemeFilters;
