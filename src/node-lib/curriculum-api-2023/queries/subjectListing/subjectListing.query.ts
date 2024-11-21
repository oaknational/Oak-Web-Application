import { Sdk } from "../../sdk";
import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";
import { SubjectListingQuery } from "../../generated/sdk";

import subjectListingSchema, {
  subjectLisitingRawSchema,
} from "./subjectListing.schema";
import { constructSubjectsFromLessonData } from "./constructSubjectsFromLessonData";

import OakError from "@/errors/OakError";

const subjectListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string }) => {
    const res = await sdk.subjectListing(args);

    const modifiedSubjectLessons = applyGenericOverridesAndExceptions<
      SubjectListingQuery["subjectLessons"][number]
    >({
      journey: "pupil",
      queryName: "pupilSubjectListingQuery",
      browseData: res.subjectLessons,
    });

    if (modifiedSubjectLessons.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const parsedModified = subjectLisitingRawSchema.parse({
      subjectLessons: modifiedSubjectLessons,
      key_stages: res.key_stages,
    });

    const processedLessons = constructSubjectsFromLessonData(
      parsedModified.subjectLessons,
    );

    const keyStages = parsedModified.key_stages.map((keyStage) => {
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
      keyStageSlug:
        parsedModified.subjectLessons[0]?.programme_fields.keystage_slug,
      keyStageTitle:
        parsedModified.subjectLessons[0]?.programme_fields.keystage_description,
      keyStages: keyStages,
    };

    return subjectListingSchema.parse(returnData);
  };

export default subjectListingQuery;
