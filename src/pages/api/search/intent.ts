import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { NextApiHandler } from "next";
import { z } from "zod";

import {
  intentRequestSchema,
  SearchIntent,
} from "@/common-lib/schemas/search-intent";
import errorReporter from "@/common-lib/error-reporter/errorReporter";
import OakError from "@/errors/OakError";
import { findPfMatch } from "@/context/Search/suggestions/findPfMatch";
import { getSuggestedFilters } from "@/context/Search/suggestions/getSuggestedFilters";
import { buildSearchIntentPrompt } from "@/utils/promptBuilder";
import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";
import getServerConfig from "@/node-lib/getServerConfig";

const reportError = errorReporter("search-intent");
const client = new OpenAI();

const handler: NextApiHandler = async (req, res) => {
  const aiSearchEnabled = getServerConfig("aiSearchEnabled");

  let searchTerm: string;

  try {
    const parsed = intentRequestSchema.parse(req.query);
    searchTerm = parsed.searchTerm;
  } catch {
    return res.status(400).json({ error: "Invalid search term" });
  }

  try {
    const pfMatch = findPfMatch(searchTerm);

    if (pfMatch?.subject) {
      const payload: SearchIntent = {
        directMatch: pfMatch,
        suggestedFilters: getSuggestedFilters(pfMatch.subject, pfMatch),
      };
      return res.status(200).json(payload);
    } else if (aiSearchEnabled) {
      // TODO: get suggested filters from subject intent
      const subjectsFromModel = await callModel(searchTerm);

      const payload = {
        directMatch: null,
        suggestedFilters: subjectsFromModel.map((filter) => {
          return { type: "subject", slug: filter.slug };
        }),
      };
      return res.status(200).json(payload);
    }

    return res.status(503).json({ message: "AI search currently unavailable" });
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
    throw response.error;
  }

  const validSubjects =
    parsedResponse?.subjects?.filter((subject) =>
      subjects.includes(subject.slug),
    ) ?? [];

  validSubjects.sort((a, b) => b.confidence - a.confidence);
  return validSubjects;
}

export default handler;
