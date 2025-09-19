import type { NextApiRequest, NextApiResponse } from "next";

import {
  intentRequestSchema,
  normalizeTerm,
} from "@/context/Search/ai-suggested-filters.schema";
import type { IntentResponse } from "@/context/Search/ai-suggested-filters.schema";

// ASF-2 Step 2: Parse request and normalize term using Zod
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IntentResponse | string>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  // Parse and normalize request
  const { term } = intentRequestSchema.parse(req.body);
  const normalized = normalizeTerm(term);
  // Expose normalized term for debugging in spike (non-contract header)
  res.setHeader("X-Normalized-Term", normalized);
  // Placeholder response for now; later steps will use `normalized`
  const payload: IntentResponse = { intent: null, relatedSubjects: [] };
  return res.status(200).json(payload);
}
