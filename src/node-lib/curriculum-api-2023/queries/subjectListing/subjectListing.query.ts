import { Sdk } from "../../sdk";

import subjectListingSchema from "./subjectListing.schema";

import OakError from "@/errors/OakError";

const subjectListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string }) => {
    const res = await sdk.subjectListing(args);
    const [keyStageSubjects] = res.keyStageSubjects;

    if (!keyStageSubjects) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const { subjects } = keyStageSubjects;

    return subjectListingSchema.parse({
      ...keyStageSubjects,
      subjects,
    });
  };

export default subjectListingQuery;
