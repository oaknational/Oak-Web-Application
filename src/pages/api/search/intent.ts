import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { NextApiHandler } from "next";
import { z } from "zod";

import {
  aiResponseSchema,
  intentRequestSchema,
  searchIntentSchema,
} from "./schemas";

import errorReporter from "@/common-lib/error-reporter/errorReporter";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const reportError = errorReporter("search-intent");
const client = new OpenAI();

// Build prompt dynamically from curriculum data
function buildSystemPrompt(subjects: string[]): string {
  return `You are analyzing a search term for a UK education platform.

The platform has the following available subject names:
${subjects.join(",")}

Analyze the search term and identify which subject names are relevant, with confidence scores 1-5 (5 being most confident).

Rules:
- Only return subject names from the list above
- Use confidence scores: 1 (low) to 5 (high)  
- Be conservative with confidence scores
- Return max 3-4 most relevant subjects
- Focus on direct subject matches first

Return your response as a JSON object with this exact structure:
{"subjects": [{"name": "subject-name", "confidence": 1-5}]}

Examples:
- "maths" → {"subjects": [{"name": "maths", "confidence": 5}]}
- "shakespeare" → {"subjects": [{"name": "english", "confidence": 5}, {"name": "drama", "confidence": 3}]}
- "ww1" → {"subjects": [{"name": "history", "confidence": 5}]}
- "photosynthesis" → {"subjects": [{"name": "biology", "confidence": 5}, {"name": "science", "confidence": 4}]}

Analyze the user's search term:
`;
}

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
    console.error("Invalid search term:", err);
    return res.status(400).json({ error: "Invalid search term" });
  }

  try {
    // TEMP: return direct match response if searchTerm is "maths"
    if (searchTerm === "maths") {
      const payload = searchIntentSchema.parse(DUMMY_DIRECT_MATCH_RESPONSE);
      return res.status(200).json(payload);
    }
    const curriculumData = await curriculumApi2023.searchPage();
    const subjectList = curriculumData.subjects.map((subject) => subject.title);
    const payload = await callModel(searchTerm, subjectList);

    return res.status(200).json(payload);
  } catch (err) {
    console.log(err);
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

async function callModel(searchTerm: string, subjects: string[]) {
  const systemContent = buildSystemPrompt(subjects);

  const response = await client.responses.parse({
    model: "gpt-5-nano",
    input: [
      {
        role: "system",
        content: systemContent,
      },
      {
        role: "user",
        content: `
        <retrieved-data>
        ${searchTerm}
        </retrieved-data>
        `,
      },
    ],
    text: {
      format: zodTextFormat(aiResponseSchema, "subjects"),
    },
  });
  const parsedResponse = response.output_parsed;
  if (parsedResponse) return parsedResponse.subjects;
  return [];
}

export default handler;
