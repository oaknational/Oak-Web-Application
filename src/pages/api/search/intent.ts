import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { NextApiHandler } from "next";
import { z } from "zod";

import {
  intentRequestSchema,
  searchIntentSchema,
} from "@/common-lib/schemas/search-intent";
import errorReporter from "@/common-lib/error-reporter/errorReporter";
import OakError from "@/errors/OakError";
import { buildSearchIntentPrompt } from "@/utils/promptBuilder";
import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";
import getServerConfig from "@/node-lib/getServerConfig";

const reportError = errorReporter("search-intent");
const client = new OpenAI();

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

const handler: NextApiHandler = async (req, res) => {
  const aiSearchEnabled = getServerConfig("aiSearchEnabled");

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
    } else if (aiSearchEnabled) {
      const subjectsFromModel = await callModel(searchTerm);
      const getTitleFromSlug = (slug: string) => {
        const subject = OAK_SUBJECTS.find((subject) => subject.slug === slug);
        if (!subject) throw new Error("failed to find subject title");
        return subject?.title || slug;
      };

      const payload = {
        directMatch: null,
        suggestedFilters: subjectsFromModel.map((filter) => {
          return {
            type: "subject",
            slug: filter.slug,
            title: getTitleFromSlug(filter.slug),
          };
        }),
      };
      return res.status(200).json(payload);
    }
    return res.status(503).json({ message: "ai search currently unavailable" });
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

export async function callModel(searchTerm: string) {
  const subjects = OAK_SUBJECTS.map((subject) => subject.slug);
  const prompt = buildSearchIntentPrompt(searchTerm, subjects);

  const response = await client.responses.parse({
    model: "gpt-5-nano",
    input: prompt,
    text: {
      format: zodTextFormat(
        z.object({
          subjects: z.array(
            z.object({
              slug: z.string(),
              confidence: z.number().min(1).max(5),
            }),
          ),
        }),
        "subjects",
      ),
    },
    reasoning: {
      effort: "low",
    },
  });
  const parsedResponse = response.output_parsed;

  if (response.error) {
    const error = new OakError({
      code: "search/failed-to-get-intent",
      meta: {
        error: response.error,
      },
    });
    reportError(error);
  }

  const validSubjects =
    parsedResponse?.subjects?.filter((subject) =>
      subjects.includes(subject.slug),
    ) ?? [];

  validSubjects.sort((a, b) => b.confidence - a.confidence);
  return validSubjects;
}

export default handler;
