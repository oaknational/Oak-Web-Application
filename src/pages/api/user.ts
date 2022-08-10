import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

import { OakUser } from "../../context/Auth";
import errorReporter from "../../common-lib/error-reporter";
import OakError, { ErrorCode } from "../../errors/OakError";
import applyHasuraClaimsToFirebaseUser from "../../node-lib/auth/applyHasuraClaimsToFirebaseUser";
import getOrCreateOakUser from "../../node-lib/auth/getOrCreateOakUser";
import verifyFirebaseToken from "../../node-lib/auth/verifyFirebaseToken";

type ResponseError = {
  code: ErrorCode;
};
type ResponseData = OakUser | ResponseError;

const reportError = errorReporter("/api/login");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method, headers } = req;

  try {
    switch (method) {
      case "POST": {
        /**
         * Validate
         * @todo do this in a middleware
         */
        const accessToken = z
          .string()
          .parse(headers.authorization?.split("Bearer ")[1]);

        /**
         * Authenticate
         * @todo do this in a middleware
         */
        const { firebaseUid, email } = await verifyFirebaseToken({
          accessToken,
        });

        /**
         * Get/create user in hasura
         */
        const user = await getOrCreateOakUser({ firebaseUid, email });

        /**
         * Set custom claims for hasura on the firebase user
         */
        await applyHasuraClaimsToFirebaseUser({ firebaseUid, user });

        /**
         * Respond with the oak user object
         */
        return res.status(200).json(user);
      }

      default: {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    reportError(error);

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
