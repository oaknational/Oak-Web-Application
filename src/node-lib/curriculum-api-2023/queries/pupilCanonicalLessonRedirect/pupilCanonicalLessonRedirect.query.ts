import {
  redirectSchema,
  Redirect,
} from "../canonicalLessonRedirect/canonicalLessonRedirect.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const pupilCanonicalLessonRedirectQuery =
  (sdk: Sdk) =>
  async (args: {
    incomingPath: string;
  }): Promise<{
    pupilCanonicalLessonRedirectData: Redirect;
  }> => {
    const { incomingPath } = args;

    const res = await sdk.pupilCanonicalLessonRedirect({
      incomingPath,
    });

    if (res.pupilCanonicalLessonRedirectData.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    if (res.pupilCanonicalLessonRedirectData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const [pupilCanonicalLessonRedirectSnake] =
      res.pupilCanonicalLessonRedirectData;

    if (!pupilCanonicalLessonRedirectSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    pupilCanonicalLessonRedirectSnake.redirect_type = parseInt(
      pupilCanonicalLessonRedirectSnake.redirect_type,
      10,
    );

    redirectSchema.parse({
      ...pupilCanonicalLessonRedirectSnake,
    });

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const pupilCanonicalLessonRedirect = keysToCamelCase(
      pupilCanonicalLessonRedirectSnake,
    ) as Redirect;

    return {
      pupilCanonicalLessonRedirectData: {
        ...pupilCanonicalLessonRedirect,
      },
    };
  };
