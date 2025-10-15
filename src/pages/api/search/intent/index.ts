import type { NextApiHandler } from "next";

import {
  intentRequestSchema,
  SearchIntent,
} from "@/common-lib/schemas/search-intent";
import errorReporter from "@/common-lib/error-reporter/errorReporter";
import OakError from "@/errors/OakError";
import { findPfMatch } from "@/context/Search/suggestions/findPfMatch";
import { getSuggestedFiltersFromSubject } from "@/context/Search/suggestions/getSuggestedFilters";
import getServerConfig from "@/node-lib/getServerConfig";
import { callModel } from "@/context/Search/ai/callModel";
import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";

const reportError = errorReporter("search-intent");

const CACHE_DURATION = 30 * 24 * 60 * 60; // 30 days

const handler: NextApiHandler = async (req, res) => {
  const aiSearchEnabled = getServerConfig("aiSearchEnabled") === "true";

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
        suggestedFilters: getSuggestedFiltersFromSubject(
          pfMatch.subject.slug,
          pfMatch,
        ),
      };
      return res.status(200).json(payload);
    } else if (aiSearchEnabled) {
      const subjectsFromModel = await callModel(searchTerm);
      const bestSubjectMatch = subjectsFromModel[0]?.slug;

      const suggestedFiltersFromSubject = bestSubjectMatch
        ? getSuggestedFiltersFromSubject(bestSubjectMatch, pfMatch)
        : [];

      const suggestedFilters = subjectsFromModel
        .map((filter) => {
          const title = OAK_SUBJECTS.find(
            (subject) => subject.slug === filter.slug,
          )?.title;
          return { type: "subject", slug: filter.slug, title };
        })
        .concat(suggestedFiltersFromSubject);

      const payload = {
        directMatch: pfMatch,
        suggestedFilters,
      };

      // Cache AI-based response in Cloudflare for 30 days
      // public = same cache for all users
      res.setHeader("Cache-Control", `public, s-maxage=${CACHE_DURATION}`);

      return res.status(200).json(payload);
    }

    return res.status(503).json({ message: "AI search currently unavailable" });
  } catch (err) {
    const error = new OakError({
      code: "search/failed-to-get-intent",
      originalError: err,
    });
    reportError(error);

    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

export default handler;
