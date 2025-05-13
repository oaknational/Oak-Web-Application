import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { getAuthenticatedEducatorApi } from "@/node-lib/educator-api";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const reportError = errorReporter("educatorApi");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await handleRequest(req, res);
}

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, getToken } = getAuth(req);
  const { programmeSlug, unitSlug } = req.query;

  if (!userId) {
    return res.status(200).end();
  }

  if (
    !programmeSlug ||
    Array.isArray(programmeSlug) ||
    !unitSlug ||
    Array.isArray(unitSlug)
  ) {
    return res.status(400).send("Bad request");
  }

  const educatorApi = await getAuthenticatedEducatorApi(getToken);

  try {
    await educatorApi.deleteUserListContent({
      userId,
      programmeSlug,
      unitSlug,
    });

    return res.status(200).end();
  } catch (err) {
    const error = new OakError({
      code: "educator-api/failed-to-unsave-unit",
      originalError: err,
      meta: {
        userId,
        programmeSlug,
        unitSlug,
      },
    });
    reportError(error);
    return res.status(500).json({ error: err });
  }
}
