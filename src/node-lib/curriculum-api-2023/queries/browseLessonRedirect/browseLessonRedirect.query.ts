import { redirectSchema, Redirect } from "../../shared.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const browseLessonRedirectQuery =
  (sdk: Sdk) =>
  async (args: {
    incomingPath: string;
  }): Promise<{
    redirectData: Redirect;
  }> => {
    const { incomingPath } = args;

    const res = await sdk.browseLessonRedirect({
      incomingPath,
    });

    if (res.redirectData.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::pupilLesson")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    if (res.redirectData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const [redirectSnake] = res.redirectData;

    if (!redirectSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    redirectSnake.redirect_type = Number.parseInt(
      redirectSnake.redirect_type,
      10,
    );

    redirectSchema.parse({
      ...redirectSnake,
    });

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const redirect = keysToCamelCase(redirectSnake) as Redirect;

    return {
      redirectData: {
        ...redirect,
      },
    };
  };
