// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

import { OakUser } from "../../../auth/useAuth";
import { confirmNewUser } from "../../../node-lib/auth";

const firebaseUserSchema = z.object({
  accessToken: z.string(),
});

type ResponseError = {
  message: string;
};
type ResponseData = OakUser | ResponseError;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  try {
    const body = JSON.parse(req.body);
    // @TODO: do this in a middlewares
    const { accessToken } = firebaseUserSchema.parse(body);

    const oakUser = await confirmNewUser(accessToken);

    return res.status(200).json(oakUser);
  } catch (error) {
    console.log(error);

    // @TODO handle error
    return res.status(403).json({
      message: "Failed to confirm new user",
    });
  }
}
