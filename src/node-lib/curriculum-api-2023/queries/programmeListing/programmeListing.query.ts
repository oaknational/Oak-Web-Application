import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";
import { toSentenceCase } from "../../helpers";

import {
  ProgrammeListingResponse,
  programmeListingResponseSchema,
  programmeListingResponseSchemaArray,
  programmeListingSchema,
} from "./programmeListing.schema";

export const getTransformedProgrammeData = (
  programmeData: ProgrammeListingResponse[],
  firstProgramme: ProgrammeListingResponse,
) => {
  const {
    examboard_display_order: examBoardDisplayOrder,
    keystage_description: keyStageTitle,
    keystage_slug: keyStageSlug,
    subject_slug: subjectSlug,
    subject: subjectTitle,
  } = firstProgramme.programme_fields;

  const programmes = programmeData.map((programme) => {
    return {
      programmeSlug: programme.programme_slug,
      subjectTitle: programme.programme_fields.subject_description,
      tierSlug: programme.programme_fields.tier_slug,
      tierTitle: programme.programme_fields.tier_description,
      tierDisplayOrder: programme.programme_fields.tier_display_order,
      examBoardSlug: programme.programme_fields.examboard_slug,
      examBoardTitle: programme.programme_fields.examboard,
      examBoardDisplayOrder:
        programme.programme_fields.examboard_display_order || 0,
    };
  });

  return {
    keyStageTitle: toSentenceCase(keyStageTitle),
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    programmes: examBoardDisplayOrder
      ? programmes.sort(
          (a, b) => a.examBoardDisplayOrder - b.examBoardDisplayOrder,
        )
      : programmes,
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

    const [firstProgram] = res.programmes;
    if (!firstProgram) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const parsedRes = programmeListingResponseSchemaArray.parse(res.programmes);
    const parsedFirstProgramme =
      programmeListingResponseSchema.parse(firstProgram);

    const transformedData = getTransformedProgrammeData(
      parsedRes,
      parsedFirstProgramme,
    );

    return programmeListingSchema.parse(transformedData);
  };

export default programmeListingQuery;
