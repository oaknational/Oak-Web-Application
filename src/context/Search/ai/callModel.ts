import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import z from "zod";

import { OAK_SUBJECTS } from "../suggestions/oakCurriculumData";

import { buildSearchIntentPrompt } from "@/utils/promptBuilder";
import { invariant } from "@/utils/invariant";
import getServerConfig from "@/node-lib/getServerConfig";

const MODEL = "cerebras/qwen-3-32b";

const client = new OpenAI({
  apiKey: getServerConfig("aiGatewayApiKey"),
  baseURL: getServerConfig("aiGatewayUrl"),
});

const schema = z.object({
  subjects: z.array(
    z.object({
      slug: z.string(),
      confidence: z.number().min(1).max(5),
    }),
  ),
});

export async function callModel(searchTerm: string) {
  const subjects = OAK_SUBJECTS.map((subject) => subject.slug);
  const prompt = buildSearchIntentPrompt(searchTerm, subjects);

  const response = await client.chat.completions.parse({
    model: MODEL,
    messages: prompt,
    response_format: zodResponseFormat(schema, "subjects_response"),
  });

  const parsedResponse = response.choices[0]?.message?.parsed;
  invariant(parsedResponse, "No LLM response");

  const validSubjects = parsedResponse.subjects
    .filter((subject) => subjects.includes(subject.slug))
    .toSorted((a, b) => b.confidence - a.confidence);

  return validSubjects;
}
