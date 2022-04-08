import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

import { OakUser } from "../../auth/useAuth";
import { login } from "../../node-lib/auth";

type ResponseError = {
  message: string;
};
type ResponseData = OakUser | ResponseError;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method, headers } = req;

  try {
    switch (method) {
      case "POST": {
        // @TODO: do this in a middlewares
        const accessToken = z.string().parse(headers.token);

        const oakUser = await login(accessToken);

        return res.status(200).json(oakUser);
      }

      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log(error);

    // @TODO handle error
    return res.status(403).json({
      message: "Failed to POST to /user",
    });
  }
}
