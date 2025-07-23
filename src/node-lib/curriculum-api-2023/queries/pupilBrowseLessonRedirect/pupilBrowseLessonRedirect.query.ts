import {
  redirectSchema,
  Redirect,
} from "../canonicalLessonRedirect/canonicalLessonRedirect.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const pupilBrowseLessonRedirectQuery =
  (sdk: Sdk) =>
  async (args: {
    incomingPath: string;
  }): Promise<{
    pupilBrowseLessonRedirectData: Redirect;
  }> => {
    const { incomingPath } = args;

    const res = await sdk.pupilBrowseLessonRedirect({
      incomingPath,
    });

    if (res.pupilBrowseLessonRedirectData.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    if (res.pupilBrowseLessonRedirectData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const [redirectSnake] = res.pupilBrowseLessonRedirectData;

    if (!redirectSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    redirectSnake.redirect_type = parseInt(redirectSnake.redirect_type, 10);

    redirectSchema.parse({
      ...redirectSnake,
    });

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const redirect = keysToCamelCase(redirectSnake) as Redirect;

    return {
      pupilBrowseLessonRedirectData: {
        ...redirect,
      },
    };
  };
