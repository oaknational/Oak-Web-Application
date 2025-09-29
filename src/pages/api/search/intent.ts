import type { NextApiHandler } from "next";
import { z } from "zod";

import { intentRequestSchema, searchIntentSchema } from "./schemas";

import errorReporter from "@/common-lib/error-reporter/errorReporter";
import OakError from "@/errors/OakError";

const reportError = errorReporter("search-intent");

const DUMMY_DIRECT_MATCH_RESPONSE = {
  directMatch: {
    subject: "maths",
    keyStage: null,
    year: null,
    examBoard: null,
  },
  suggestedFilters: [
    { type: "subject", value: "maths" },
    { type: "key-stage", value: "ks1" },
    { type: "key-stage", value: "ks2" },
    { type: "key-stage", value: "ks3" },
    { type: "key-stage", value: "ks4" },
    { type: "exam-board", value: "aqa" },
    { type: "exam-board", value: "edexcel" },
  ],
} satisfies z.infer<typeof searchIntentSchema>;

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
  } catch (err) {
    return res.status(400).json({ error: "Invalid search term" });
  }

  try {
    // TEMP: return direct match response if searchTerm is "maths"
    if (searchTerm === "maths") {
      const payload = searchIntentSchema.parse(DUMMY_DIRECT_MATCH_RESPONSE);
      return res.status(200).json(payload);
    }

    const payload = searchIntentSchema.parse(DUMMY_AI_RESPONSE);
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
