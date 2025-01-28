import { z } from "zod";

import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { ProgrammeListingQuery } from "../../generated/sdk";
import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";

import {
  Programme,
  ProgrammeListingPageData,
  ProgrammeListingResponse,
  programmeListingResponseSchema,
} from "./programmeListing.schema";

export const getTransformedProgrammeData = (
  programmeData: ProgrammeListingResponse[],
  programmeFields: ProgrammeListingResponse["programme_fields"],
): ProgrammeListingPageData => {
  const {
    keystage_description: keyStageTitle,
    keystage_slug: keyStageSlug,
    subject_slug: subjectSlug,
    subject: subjectTitle,
    pathway: pathwayTitle,
  } = programmeFields;

  const programmes = programmeData.map((programme): Programme => {
    return {
      programmeSlug: programme.programme_slug,
      subjectTitle: programme.programme_fields.subject,
      tierSlug: programme.programme_fields.tier_slug,
      tierTitle: programme.programme_fields.tier_description,
      tierDisplayOrder: programme.programme_fields.tier_display_order,
      examBoardSlug: programme.programme_fields.examboard_slug,
      examBoardTitle: programme.programme_fields.examboard,
      examBoardDisplayOrder:
        programme.programme_fields.examboard_display_order || 0,
      pathwaySlug: programme.programme_fields.pathway_slug,
      pathwayTitle: programme.programme_fields.pathway,
      pathwayDisplayOrder: programme.programme_fields.pathway_display_order,
    };
  });

  const sortedProgrammes = programmes.sort((a, b) => {
    const aOrder = a.examBoardDisplayOrder ?? 0;
    const bOrder = b.examBoardDisplayOrder ?? 0;
    return aOrder - bOrder;
  });

  return {
    keyStageTitle,
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    pathwayTitle,
    programmes: sortedProgrammes,
    legacy: programmeFields.legacy ? true : false,
  };
};

const programmeListingQuery =
  (sdk: Sdk) =>
  async (args: {
    keyStageSlug: string;
    subjectSlug: string;
    isLegacy: boolean;
  }) => {
    const res = await sdk.programmeListing(args);

    const modified = applyGenericOverridesAndExceptions<
      ProgrammeListingQuery["programmes"][number]
    >({
      journey: "teacher",
      queryName: "programmeListingQuery",
      browseData: res.programmes,
    });

    const syntheticUnitvariantLessonsSchemaArray = z.array(
      programmeListingResponseSchema,
    );

    const parsedModified =
      syntheticUnitvariantLessonsSchemaArray.parse(modified);

    if (parsedModified.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const programmeFieldsSnakeCase = modified.reduce(
      (acc, val) => ({ ...acc, ...val.programme_fields }),
      {} as ProgrammeListingResponse["programme_fields"],
    );

    const transformedData = getTransformedProgrammeData(
      parsedModified,
      programmeFieldsSnakeCase,
    );

    return transformedData;
  };

export default programmeListingQuery;
