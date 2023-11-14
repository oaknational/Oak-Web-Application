import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import getNextLessonsInUnit from "./getNextLessonsInUnit";
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
    const units = res.unit;

    if (!pages || !units || pages.length === 0 || units.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (pages.length > 1 || units.length > 1) {
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
    const unit = units[0];
    const nextLessons = getNextLessonsInUnit(unit?.lessons, args.lessonSlug);

    return lessonDownloadsSchema.parse({
      ...page,
      nextLessons,
      isLegacy: false,
    });
  };

export default lessonDownloadsQuery;
