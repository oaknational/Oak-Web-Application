import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import lessonDownloadsSchema from "./lessonDownloads.schema";

const lessonDownloadsQuery =
  (sdk: Sdk) =>
  async (args: {
    programmeSlug: string;
    unitSlug: string;
    lessonSlug: string;
  }) => {
    const res = await sdk.lessonDownloads(args);
    const [downloads] = res.downloads;

    if (!downloads) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.downloads.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonListing")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    return lessonDownloadsSchema.parse(downloads);
  };

export default lessonDownloadsQuery;
