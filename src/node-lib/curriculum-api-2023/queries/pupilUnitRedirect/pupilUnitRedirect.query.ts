import { redirectSchema, Redirect } from "../../shared.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const pupilUnitRedirectQuery =
  (sdk: Sdk) =>
  async (args: {
    incomingPath: string;
  }): Promise<{
    pupilUnitRedirectData: Redirect;
  }> => {
    const { incomingPath } = args;

    const res = await sdk.pupilUnitRedirect({
      incomingPath,
    });

    if (res.pupilUnitRedirectData.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::unit")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    if (res.pupilUnitRedirectData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const [pupilUnitRedirectSnake] = res.pupilUnitRedirectData;

    if (!pupilUnitRedirectSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    pupilUnitRedirectSnake.redirect_type = parseInt(
      pupilUnitRedirectSnake.redirect_type,
      10,
    );

    redirectSchema.parse({
      ...pupilUnitRedirectSnake,
    });

    // We've already parsed this data with Zod so we can safely cast it to the correct type
    const pupilUnitRedirect = keysToCamelCase(
      pupilUnitRedirectSnake,
    ) as Redirect;

    return {
      pupilUnitRedirectData: {
        ...pupilUnitRedirect,
      },
    };
  };
