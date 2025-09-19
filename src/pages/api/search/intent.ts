import type { NextApiRequest, NextApiResponse } from "next";

import type { IntentResponse } from "@/context/Search/ai-suggested-filters.schema";

// ASF-2 Step 1: Create API route skeleton
// - POST only
// - Returns empty suggestions by default (fleshed out in subsequent steps)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IntentResponse | string>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  // Placeholder response; later steps will parse the request, call the model,
  // validate/whitelist, and return structured data.
  const payload: IntentResponse = {
    intent: null,
    relatedSubjects: [],
  };

  return res.status(200).json(payload);
}
