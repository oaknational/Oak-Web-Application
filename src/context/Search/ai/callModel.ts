import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import z from "zod";

import { OAK_SUBJECTS } from "../suggestions/oakCurriculumData";

import { buildSearchIntentPrompt } from "@/utils/promptBuilder";

const client = new OpenAI();
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
    throw response.error;
  }

  const validSubjects =
    parsedResponse?.subjects?.filter((subject) =>
      subjects.includes(subject.slug),
    ) ?? [];

  validSubjects.sort((a, b) => b.confidence - a.confidence);
  return validSubjects;
}
