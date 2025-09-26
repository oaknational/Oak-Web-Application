import type { NextApiHandler } from "next";
import { z } from "zod";

import { intentRequestSchema, searchIntentSchema } from "./schemas";

import errorReporter from "@/common-lib/error-reporter/errorReporter";
import OakError from "@/errors/OakError";

const reportError = errorReporter("search-intent");

export const DUMMY_DIRECT_MATCH_RESPONSE = {
  directMatch: {
    subject: { slug: "maths", title: "Maths" },
    keyStage: null,
    year: null,
    examBoard: null,
  },
  suggestedFilters: [
    { type: "subject", slug: "maths", title: "Maths" },
    { type: "key-stage", slug: "ks1", title: "Key Stage 1" },
    { type: "key-stage", slug: "ks2", title: "Key Stage 2" },
    { type: "key-stage", slug: "ks3", title: "Key Stage 3" },
    { type: "key-stage", slug: "ks4", title: "Key Stage 4" },
    { type: "exam-board", slug: "aqa", title: "AQA" },
    { type: "exam-board", slug: "edexcel", title: "Edexcel" },
  ],
} satisfies z.infer<typeof searchIntentSchema>;

const DUMMY_AI_RESPONSE = {
  directMatch: null,
  suggestedFilters: [
    { type: "subject", slug: "maths", title: "Maths" },
    { type: "key-stage", slug: "ks4", title: "Key Stage 4" },
    { type: "exam-board", slug: "aqa", title: "AQA" },
    { type: "subject", slug: "science", title: "Science" },
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
