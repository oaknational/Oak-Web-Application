import { NextApiRequest, NextApiResponse } from "next";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { auth0 } from "@/node-lib/auth/auth0";

/**
 * Proxies requests to the download API to apply the user's access token
 */
export default auth0.withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { lessonSlug, selection } = req.query;
  const { accessToken } = await auth0.getAccessToken(req, res);

  if (typeof accessToken !== "string") {
    return res.status(401).json({
      message: "Access token not found",
    });
  }

  if (typeof lessonSlug !== "string" || typeof selection !== "string") {
    return res.status(400).json({
      message: "Must provide a 'lessonSlug' and a 'selection' query parameter",
    });
  }

  const url = new URL(getBrowserConfig("downloadApiUrl"));
  url.pathname = `/api/lesson/${lessonSlug}/download`;
  url.searchParams.append("selection", selection);

  const result = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (result.status !== 200) {
    return res
      .status(result.status)
      .json({ error: "Failed to fetch download link" });
  }

  res.status(200).json(await result.json());
});
