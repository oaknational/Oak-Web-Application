type GenericUnitListingData<U> = {
  units: U[][];
};

function filterLearningTheme<
  U extends { learningThemes: { themeSlug: string | null }[] | null },
>(
  themeSlug: string | undefined,
  units: GenericUnitListingData<U>["units"],
): GenericUnitListingData<U>["units"] {
  if (themeSlug) {
    return units.filter((unitVariant) =>
      unitVariant.some(
        (unit) =>
          unit.learningThemes?.some(
            (learningTheme) => learningTheme.themeSlug === themeSlug,
          ),
      ),
    );
  } else {
    return units;
  }
}

export default filterLearningTheme;
