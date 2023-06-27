import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import subjectListingSchema from "./subjectListing.schema";

const subjectListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string }) => {
    const res = await sdk.subjectListing(args);

    const [keyStageSubjects] = res.keyStageSubjects;

    if (!keyStageSubjects) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return subjectListingSchema.parse(keyStageSubjects);
  };

export default subjectListingQuery;
