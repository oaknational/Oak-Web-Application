import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import subjectListingSchema from "./subjectListing.schema";

const subjectListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string }) => {
    const res = await sdk.subjectListing(args);
    const [keyStageSubjects] = res.keyStageSubjects;
    const [keyStages] = res.keyStages;

    const subjectListing = {
      ...keyStageSubjects,
      keyStages: keyStages?.keyStages,
    };

    if (!keyStageSubjects) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    return subjectListingSchema.parse(subjectListing);
  };

export default subjectListingQuery;
