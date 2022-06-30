import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

import createErrorHandler from "../../../common-lib/error-handler";
import OakError, { ErrorCode } from "../../../errors/OakError";

const consentsSchema = z.array(
  z.object({
    id: z.string(),
    version: z.number(),
    enabled: z.boolean(),
  })
);
type Consents = z.infer<typeof consentsSchema>;

type ResponseError = {
  code: ErrorCode;
};
type ResponseData = Consents | ResponseError;

const errorHandler = createErrorHandler("/api/cookies/consent");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method, body } = req;

  try {
    switch (method) {
      case "POST": {
        /**
         * Validate
         * @todo do this in a middleware
         */
        const consents = consentsSchema.parse(JSON.parse(body));
        /**
         * Anonymise IP
         */
        const anonymisedIP = "123";
        const timestamp = Date.now();

        console.log(timestamp, anonymisedIP, consents);

        /**
         * Respond with the oak user object
         */
        return res.status(200).json(consents);
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
