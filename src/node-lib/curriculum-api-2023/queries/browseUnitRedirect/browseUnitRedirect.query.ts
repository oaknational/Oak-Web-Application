import {
  redirectSchema,
  Redirect,
} from "../canonicalLessonRedirect/canonicalLessonRedirect.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const browseUnitRedirectQuery =
  (sdk: Sdk) =>
  async (args: {
    incomingPath: string;
  }): Promise<{
    browseUnitRedirectData: Redirect;
  }> => {
    const { incomingPath } = args;

    const res = await sdk.browseUnitRedirect({
      incomingPath,
    });

    if (res.browseUnitRedirectData.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::unit")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    if (res.browseUnitRedirectData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const [browseUnitRedirectSnake] = res.browseUnitRedirectData;

    if (!browseUnitRedirectSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    browseUnitRedirectSnake.redirect_type = parseInt(
      browseUnitRedirectSnake.redirect_type,
      10,
    );

    redirectSchema.parse({
      ...browseUnitRedirectSnake,
    });

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const browseUnitRedirect = keysToCamelCase(
      browseUnitRedirectSnake,
    ) as Redirect;

    return {
      browseUnitRedirectData: {
        ...browseUnitRedirect,
      },
    };
  };
