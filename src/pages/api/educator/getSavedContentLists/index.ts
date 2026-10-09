import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import errorReporter from "@/common-lib/error-reporter";
import { getUserListContent } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent";
import OakError from "@/errors/OakError";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleRequest(req, res);
}

const reportError = errorReporter("educatorApi");

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, getToken } = getAuth(req);

  if (!userId) {
    return res.status(401).json({});
  }

  try {
    const myLibraryData = await getUserListContent(getToken, userId);

    return res.status(200).json(myLibraryData);
  } catch (err) {
    const error = new OakError({
      code: "educator-api/failed-to-get-saved-units",
      meta: {
        userId,
        error: err,
      },
    });
    reportError(error);

    return res.status(500).json({ error: JSON.stringify(err) });
  }
}
