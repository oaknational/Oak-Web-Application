import {
  Programme,
  ProgrammeListingPageData,
} from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

/**
 * Tranform full programme listing data into new and legacy formats
 * with consideration for edge cases not currently handled by the API.
 * To be used by the programme listing page.
 */
export const generateProgrammeListing = (
  programmeListing: ProgrammeListingPageData,
  isLegacy: boolean,
) => {
  const programmes = transformProgrammeSlugs(
    generateCorrectProgrammes(programmeListing.programmes, isLegacy),
    isLegacy,
  );

  return {
    ...programmeListing,
    programmes,
  };
};

const transformProgrammeSlugs = (
  programmes: Programme[],
  isLegacy: boolean,
) => {
  if (isLegacy) {
    return programmes.map((p) => {
      if (p.programmeSlug.endsWith("-l")) return p;
      p.programmeSlug = `${p.programmeSlug}-l`;
      return p;
    });
  }

  return programmes;
};

/**
 * We can't distinguish between legacy and new programmes in the API, so we have to do it here manually.
 * This is a temporary solution until Cycle 1 Maths and Combined Science curriculum are fully released, at which point this should be removed.
 */
export const generateCorrectProgrammes = (
  programmes: Programme[],
  isLegacy: boolean,
) => {
  const subject = programmes[0]?.subjectTitle;

  if (subject === "Maths" && !isLegacy) {
    // remove 'core' tier from new maths programmes
    return programmes.filter((p) => p.tierSlug !== "core");
  } else if (subject === "Combined Science" && isLegacy) {
    // remove examboards from legacy combined science programmes
    return programmes
      .map((programme) => {
        const examboardSlug = programme.examBoardSlug;
        if (examboardSlug) {
          programme.examBoardDisplayOrder = null;
          programme.examBoardSlug = null;
          programme.examBoardTitle = null;
          programme.programmeSlug = programme.programmeSlug.replace(
            `-${examboardSlug}`,
            "",
          );
        }
        return programme;
      })
      .filter((p, i, a) => {
        const tier = p.tierSlug;
        const firstMatch = a.find((p) => p.tierSlug === tier);
        return firstMatch ? a.indexOf(firstMatch) === i : true;
      });
  }

  return programmes;
};
