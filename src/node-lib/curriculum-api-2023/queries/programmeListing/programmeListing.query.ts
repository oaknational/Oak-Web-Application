import { z } from "zod";

import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { toSentenceCase } from "../../helpers";
import { ProgrammeListingQuery } from "../../generated/sdk";
import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";

import {
  Programme,
  ProgrammeListingResponse,
  programmeListingSchema,
  programmeListingResponseSchema,
} from "./programmeListing.schema";

export const getTransformedProgrammeData = (
  programmeData: ProgrammeListingResponse[],
  firstProgramme: ProgrammeListingResponse,
) => {
  const {
    keystage_description: keyStageTitle,
    keystage_slug: keyStageSlug,
    subject_slug: subjectSlug,
    subject: subjectTitle,
  } = firstProgramme.programme_fields;

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
    };
  });

  const sortedProgrammes = programmes.sort((a, b) => {
    const aOrder = a.examBoardDisplayOrder ?? 0;
    const bOrder = b.examBoardDisplayOrder ?? 0;
    return aOrder - bOrder;
  });

  return {
    keyStageTitle: toSentenceCase(keyStageTitle),
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    programmes: sortedProgrammes,
    legacy: firstProgramme.is_legacy,
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

    if (modified.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const [firstProgram] = modified;

    const syntheticUnitvariantLessonsSchemaArray = z.array(
      programmeListingResponseSchema,
    );
    const parsedRes = syntheticUnitvariantLessonsSchemaArray.parse(
      res.programmes,
    );
    const parsedFirstProgramme =
      programmeListingResponseSchema.parse(firstProgram);

    const transformedData = getTransformedProgrammeData(
      parsedRes,
      parsedFirstProgramme,
    );

    return programmeListingSchema.parse(transformedData);
  };

export default programmeListingQuery;
