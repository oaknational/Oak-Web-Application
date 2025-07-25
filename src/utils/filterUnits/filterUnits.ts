import { SubjectCategory } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

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
    subjectCategories?: (SubjectCategory | null)[] | null;
    yearSlug?: string | null;
  },
>({
  themeSlug,
  categorySlug,
  yearGroup,
  units,
}: FilterUnitsParams<U>): GenericUnitListingData<U>["units"] {
  const theme = themeSlug === "all" ? undefined : themeSlug;
  return units.filter((unitVariant) =>
    unitVariant.some((unit) => {
      const themeMatch = theme
        ? unit.learningThemes?.some(
            (learningTheme) => learningTheme.themeSlug === theme,
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
      const yearGroupMatch = yearGroup ? unit.yearSlug === yearGroup : true;

      // display units with "all-years" year group within all year groups
      const allYearsMatch = yearGroup ? unit.yearSlug === "all-years" : true;

      return (
        (themeMatch && categoryMatch && yearGroupMatch) ||
        (themeMatch && categoryMatch && allYearsMatch)
      );
    }),
  );
}

export default filterUnits;
