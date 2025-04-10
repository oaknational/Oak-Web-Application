import {
  ProgrammeFields,
  yearSlugs,
  yearDescriptions,
} from "@oaknational/oak-curriculum-schema";

export const getCorrectYear = ({
  programmeSlugByYear,
  programmeFields,
}: {
  programmeSlugByYear: string[];
  programmeFields: ProgrammeFields;
}) => {
  const sortedSlugs = programmeSlugByYear.toSorted((a, b) =>
    a.localeCompare(b),
  );
  const yearSlug = sortedSlugs[0]
    ?.split(`${programmeFields.phase_slug}-`)[1]
    ?.replace("-l", "");

  const parsedYearSlug = yearSlugs.safeParse(yearSlug);

  const modifiedProgrammeFields = { ...programmeFields };

  // don't mdify year data if the year slug is "all-years"
  if (programmeFields.year_slug === "all-years") {
    return modifiedProgrammeFields;
  }

  if (
    parsedYearSlug.success &&
    parsedYearSlug.data !== programmeFields.year_slug
  ) {
    modifiedProgrammeFields.year_slug = parsedYearSlug.data;
    const parsedYearDescription = yearDescriptions.safeParse(
      parsedYearSlug.data.replace("year-", "Year "),
    ).data;
    if (parsedYearDescription) {
      modifiedProgrammeFields.year_description = parsedYearDescription;
    }
  }

  return modifiedProgrammeFields;
};
