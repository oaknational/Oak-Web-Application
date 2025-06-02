import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { getAuthenticatedEducatorApi } from "@/node-lib/educator-api";
import errorReporter from "@/common-lib/error-reporter";
import { getUserListContentCountResponse } from "@/node-lib/educator-api/queries/getUserListContentCount/getUserListContentCount.types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleRequest(req, res);
}

const reportError = errorReporter("educatorApi");

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, getToken } = getAuth(req);

  if (!userId) {
    return res.status(401).json(0);
  }

  const educatorApi = await getAuthenticatedEducatorApi(getToken);

  try {
    const result = await educatorApi.getUserListContentCount({
      userId,
    });

    const parsedResponse = getUserListContentCountResponse.parse(result);

    return res
      .status(200)
      .json(parsedResponse.content_lists_aggregate.aggregate.count);
  } catch (err) {
    reportError(err, {
      code: "educator-api/failed-to-get-saved-units",
      meta: {
        userId,
      },
    });
    return res.status(500).json({ error: JSON.stringify(err) });
  }
}
