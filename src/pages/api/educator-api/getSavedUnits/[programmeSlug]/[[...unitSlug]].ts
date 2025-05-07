import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { getAuthenticatedEducatorApi } from "@/node-lib/educator-api";
import { getUserContentResponse } from "@/node-lib/educator-api/queries/getUserContent/getUserContent.types";
import { InputMaybe } from "@/node-lib/curriculum-api-2023/generated/sdk";
import { Content_Bool_Exp } from "@/node-lib/educator-api/generated/sdk";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleRequest(req, res);
}

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const { userId, getToken } = getAuth(req);
  const { programmeSlug, unitSlug } = req.query;

  if (!userId) {
    return res.status(200).json([]);
  }
  if (
    !programmeSlug ||
    Array.isArray(programmeSlug) ||
    Array.isArray(unitSlug)
  ) {
    return res.status(400).send("Bad request");
  }

  const educatorApi = await getAuthenticatedEducatorApi(getToken);

  try {
    const contentDataWhere: InputMaybe<Content_Bool_Exp> = {
      programme_slug: { _eq: programmeSlug },
    };

    if (unitSlug) {
      contentDataWhere["unit_slug"] = { _eq: unitSlug };
    }

    const result = await educatorApi.getUserContent({
      userId,
      contentDataWhere,
    });

    const parsedUnits = getUserContentResponse.parse(result);

    if (parsedUnits.users_content.length === 0) {
      return res.status(200).send([]);
    }
    const units = parsedUnits.users_content.map(
      (unit) => unit.content.unit_slug,
    );
    return res.status(200).json(units);
  } catch (err) {
    console.error("Error fetching units:", err);
    return res.status(500).json({ error: JSON.stringify(err) });
  }
}
