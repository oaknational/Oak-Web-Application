type GenericUnitListingData<U> = {
  units: U[][];
};

function filterLearningTheme<
  U extends {
    learningThemes?: { themeSlug?: string | null }[] | null;
    subjectCategories?: ({ label: string; slug: string } | null)[] | null;
  },
>(
  themeSlug: string | undefined,
  categorySlug: string | undefined,
  units: GenericUnitListingData<U>["units"],
): GenericUnitListingData<U>["units"] {
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

      return themeMatch && categoryMatch;
    }),
  );
}

export default filterLearningTheme;
