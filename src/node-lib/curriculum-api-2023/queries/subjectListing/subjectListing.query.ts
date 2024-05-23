import { Sdk } from "../../sdk";

import subjectListingSchema, {
  subjectLisitingRawSchema,
} from "./subjectListing.schema";
import { processLessons } from "./processLesson";

import OakError from "@/errors/OakError";

const subjectListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string; isLegacy: boolean }) => {
    const res = await sdk.subjectListing(args);

    const { subjectLessons, key_stages } = subjectLisitingRawSchema.parse(res);

    if (!subjectLessons || subjectLessons.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const processedLessons = processLessons(subjectLessons);

    const keyStages = key_stages.map((keyStage) => {
      const keyStageNew = {
        slug: keyStage.slug,
        title: keyStage.description,
        shortCode: keyStage.keystage,
        displayOrder: keyStage.display_order,
      };
      return keyStageNew;
    });

    const returnData = {
      subjects: processedLessons,
      keyStageSlug: subjectLessons[0]?.programme_fields.keystage_slug,
      keyStageTitle: subjectLessons[0]?.programme_fields.keystage_description,
      keyStages: keyStages,
    };

    return subjectListingSchema.parse({
      ...returnData,
    });
  };

export default subjectListingQuery;
