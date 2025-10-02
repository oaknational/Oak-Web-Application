import type { NextApiHandler } from "next";
import { z } from "zod";

import {
  intentRequestSchema,
  SearchIntent,
  searchIntentSchema,
} from "@/common-lib/schemas/search-intent";
import errorReporter from "@/common-lib/error-reporter/errorReporter";
import OakError from "@/errors/OakError";
import { findPfMatch } from "@/context/Search/suggestions/findPfMatch";
import { getSuggestedFilters } from "@/context/Search/suggestions/getSuggestedFilters";

const reportError = errorReporter("search-intent");

const DUMMY_AI_RESPONSE = {
  directMatch: null,
  suggestedFilters: [
    { type: "subject", value: "maths" },
    { type: "key-stage", value: "ks4" },
    { type: "exam-board", value: "aqa" },
    { type: "subject", value: "science" },
  ],
} satisfies z.infer<typeof searchIntentSchema>;

const handler: NextApiHandler = async (req, res) => {
  let searchTerm: string;

  try {
    const parsed = intentRequestSchema.parse(req.query);
    searchTerm = parsed.searchTerm;
  } catch {
    return res.status(400).json({ error: "Invalid search term" });
  }

  try {
    const pfMatch = findPfMatch(searchTerm);

    if (!pfMatch || pfMatch.subject === null) {
      // use AI to get subject intent if no direct match for subject
      // TODO: get suggested filters from subject intent
      const payload = searchIntentSchema.parse(DUMMY_AI_RESPONSE);
      return res.status(200).json(payload);
    }

    const payload: SearchIntent = {
      directMatch: pfMatch,
      suggestedFilters: getSuggestedFilters(pfMatch.subject, pfMatch),
    };
    return res.status(200).json(payload);
  } catch (err) {
    const error = new OakError({
      code: "search/failed-to-get-intent",
      meta: {
        error: err,
      },
    });
    reportError(error);

    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

export default handler;
