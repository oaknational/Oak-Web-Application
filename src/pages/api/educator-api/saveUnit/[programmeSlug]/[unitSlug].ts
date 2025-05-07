import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { getAuthenticatedEducatorApi } from "@/node-lib/educator-api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await handleRequest(req, res);
}

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, getToken } = getAuth(req);
  const { programmeSlug, unitSlug } = req.query;
  const listTitle = "Saved content";
  console.log("diego listTitle", userId);
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
    const result = await educatorApi.createUserListContent({
      userId,
      unitSlug,
      programmeSlug,
      listTitle,
    });

    console.log("diego result", result);

    return res.status(200).end();
  } catch (err) {
    console.error("Error saving unit:", err);
    return res.status(500).json({ error: err });
  }
}
