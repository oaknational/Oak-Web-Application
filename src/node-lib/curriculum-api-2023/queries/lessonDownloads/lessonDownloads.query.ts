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
    const pages = res.downloads;

    if (!pages || pages.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (pages.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonDownloads")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const page = pages[0];

    return lessonDownloadsSchema.parse({
      ...page,
      isLegacy: false,
    });
  };

export default lessonDownloadsQuery;
