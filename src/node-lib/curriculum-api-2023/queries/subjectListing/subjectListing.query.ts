import { Sdk } from "../../sdk";

import subjectListingSchema from "./subjectListing.schema";

const subjectListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string }) => {
    const res = await sdk.subjectListing(args);

    return subjectListingSchema.parse(res.published_mv_subject_listing[0]);
  };

export default subjectListingQuery;
