import { redirectSchema, Redirect } from "./canonicalLessonRedirect.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const canonicalLessonRedirectQuery =
  (sdk: Sdk) =>
  async (args: {
    incomingPath: string;
  }): Promise<{
    canonicalLessonRedirectData: Redirect;
  }> => {
    const { incomingPath } = args;

    const res = await sdk.canonicalLessonRedirect({
      incomingPath,
    });

    if (res.canonicalLessonRedirectData.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    if (res.canonicalLessonRedirectData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const [canonicalLessonRedirectSnake] = res.canonicalLessonRedirectData;

    if (!canonicalLessonRedirectSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    redirectSchema.parse({
      ...canonicalLessonRedirectSnake,
    });

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const canonicalLessonRedirect = keysToCamelCase(
      canonicalLessonRedirectSnake,
    ) as Redirect;

    return {
      canonicalLessonRedirectData: {
        ...canonicalLessonRedirect,
      },
    };
  };
