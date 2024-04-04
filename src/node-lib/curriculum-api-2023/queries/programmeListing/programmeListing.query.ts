import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import { programmeListingSchema } from "./programmeListing.schema";

const programmeListingQuery =
  (sdk: Sdk) =>
  async (args: {
    keyStageSlug: string;
    subjectSlug: string;
    isLegacy: boolean;
  }) => {
    const res = await sdk.programmeListing(args);
    const [programmes] = res.programmes;

    if (!programmes) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    function toSentenceCase(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    return programmeListingSchema.parse({
      ...programmes,
      keyStageTitle: programmes.keyStageTitle
        ? toSentenceCase(programmes.keyStageTitle)
        : null,
    });
  };

export default programmeListingQuery;
