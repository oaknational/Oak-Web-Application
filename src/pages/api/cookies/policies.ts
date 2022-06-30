import type { NextApiRequest, NextApiResponse } from "next";

import createErrorHandler from "../../../common-lib/error-handler";
import OakError, { ErrorCode } from "../../../errors/OakError";
import cookiePolicies from "../../../browser-lib/fixtures/cookiePolicies";

type ResponseError = {
  code: ErrorCode;
};
type CookiePolicies = typeof cookiePolicies;
type ResponseData = CookiePolicies | ResponseError;

const errorHandler = createErrorHandler("/api/cookies/policies");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        /**
         * Respond with the oak user object
         */
        return res.status(200).json(cookiePolicies);
      }

      default: {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    errorHandler(error);

    if (error instanceof OakError) {
      return res.status(error.config.responseStatusCode || 500).json({
        code: error.code,
      });
    }

    return res.status(500).json({
      code: "misc/unknown",
    });
  }
}
