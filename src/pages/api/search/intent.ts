import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { NextApiHandler } from "next";
import { z } from "zod";

import { intentRequestSchema, searchIntentSchema } from "./schemas";

import errorReporter from "@/common-lib/error-reporter/errorReporter";
import OakError from "@/errors/OakError";
import { buildSearchIntentPrompt } from "@/utils/promptBuilder";
import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";

const reportError = errorReporter("search-intent");
const client = new OpenAI();

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

    const modelResponse = await callModel(searchTerm);

    const payload = {
      directMatch: null,
      suggestedFilters: [
        ...modelResponse.map((filter) => {
          return { type: "subject", slug: filter.slug };
        }),
      ],
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
  });
  const parsedResponse = response.output_parsed;

  // Filter out any subjects that aren't in our OAK_SUBJECTS array
  const validSubjects =
    parsedResponse?.subjects?.filter((subject) =>
      subjects.includes(subject.slug),
    ) ?? [];

  const sortedResponse = validSubjects
    .sort((a, b) => a.confidence - b.confidence)
    .reverse();
  return sortedResponse;
}

export default handler;
