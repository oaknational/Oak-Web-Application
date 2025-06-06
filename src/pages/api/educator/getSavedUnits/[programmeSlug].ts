import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { getAuthenticatedEducatorApi } from "@/node-lib/educator-api";
import { getUserContentResponse } from "@/node-lib/educator-api/queries/getUserContent/getUserContent.types";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleRequest(req, res);
}

const reportError = errorReporter("educatorApi");

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, getToken } = getAuth(req);
  const { programmeSlug } = req.query;

  if (!userId) {
    return res.status(401).json([]);
  }
  if (!programmeSlug || Array.isArray(programmeSlug)) {
    return res.status(400).send("Bad request");
  }

  const educatorApi = await getAuthenticatedEducatorApi(getToken);

  try {
    const result = await educatorApi.getUserContent({
      userId,
      programmeSlug,
    });
    const parsedUnits = getUserContentResponse.parse(result);

    if (parsedUnits.users_content.length === 0) {
      return res.status(200).send([]);
    }
    const units = parsedUnits.users_content
      .map((unit) => unit.users_content_lists?.content.unit_slug)
      .filter((unit) => !!unit);

    return res.status(200).json(units);
  } catch (err) {
    const error = new OakError({
      code: "educator-api/failed-to-get-saved-units",
      meta: {
        userId,
        programmeSlug,
        error: err,
      },
    });
    reportError(error);
    return res.status(500).json({ error: JSON.stringify(err) });
  }
}
