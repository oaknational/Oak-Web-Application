type GenericUnitListingData<U> = {
  units: U[][];
};
type FilterUnitsParams<U> = {
  themeSlug?: string;
  categorySlug?: string;
  yearGroup?: string;
  units: GenericUnitListingData<U>["units"];
};

function filterUnits<
  U extends {
    learningThemes?: { themeSlug?: string | null }[] | null;
    subjectCategories?: ({ label: string; slug: string } | null)[] | null;
    year?: string | null;
  },
>({
  themeSlug,
  categorySlug,
  yearGroup,
  units,
}: FilterUnitsParams<U>): GenericUnitListingData<U>["units"] {
  return units.filter((unitVariant) =>
    unitVariant.some((unit) => {
      const themeMatch = themeSlug
        ? unit.learningThemes?.some(
            (learningTheme) => learningTheme.themeSlug === themeSlug,
          )
        : true;

      const categoryMatch = categorySlug
        ? unit.subjectCategories?.some((category) => {
            if (!category) {
              return false;
            }
            return category.slug === categorySlug;
          })
        : true;
      const yearGroupMatch = yearGroup ? unit.year === yearGroup : true;

      return themeMatch && categoryMatch && yearGroupMatch;
    }),
  );
}

export default filterUnits;
