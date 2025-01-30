import { Sdk } from "../../sdk";
import { applyGenericOverridesAndExceptions } from "../../helpers/overridesAndExceptions";
import { SubjectListingQuery } from "../../generated/sdk";

import subjectListingSchema, {
  subjectLisitingRawSchema,
} from "./subjectListing.schema";
import { constructSubjectsFromUnitData } from "./constructSubjectsFromUnitData";

import OakError from "@/errors/OakError";

const subjectListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string }) => {
    const res = await sdk.subjectListing(args);

    const { subjectUnits, key_stages } = subjectLisitingRawSchema.parse(res);

    const modifiedSubjectUnits = applyGenericOverridesAndExceptions<
      SubjectListingQuery["subjectUnits"][number]
    >({
      journey: "teacher",
      queryName: "subjectListingQuery",
      browseData: subjectUnits,
    });

    if (modifiedSubjectUnits.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const parsedModified = subjectLisitingRawSchema.parse({
      subjectUnits: modifiedSubjectUnits,
      key_stages,
    });

    const processedUnits = constructSubjectsFromUnitData(
      parsedModified.subjectUnits,
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
      subjects: processedUnits,
      keyStageSlug:
        parsedModified.subjectUnits[0]?.programme_fields.keystage_slug,
      keyStageTitle:
        parsedModified.subjectUnits[0]?.programme_fields.keystage_description,
      keyStages: keyStages,
    };

    return subjectListingSchema.parse({
      ...returnData,
    });
  };

export default subjectListingQuery;
