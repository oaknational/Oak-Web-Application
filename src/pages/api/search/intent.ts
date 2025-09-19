import type { NextApiRequest, NextApiResponse } from "next";

import {
  intentRequestSchema,
  normalizeTerm,
} from "@/context/Search/ai-suggested-filters.schema";
import type { IntentResponse } from "@/context/Search/ai-suggested-filters.schema";

// Build a strict JSON-only prompt for the model
function buildPrompt(term: string) {
  const system =
    "You infer search intent for a school curriculum site. Return ONLY JSON.";
  const user = `Given the search term, infer intent and up to 5 related subjects.
Output JSON with keys intent and relatedSubjects.
intent is one of:
 - {"type":"subject","subject":<subject-slug>,"confidence":<0..1>}
 - {"type":"subject-keystage","subject":<subject-slug>,"keyStage":<ks-slug>,"confidence":<0..1>}
 - {"type":"topic","topic":<topic-slug-or-name>,"confidence":<0..1>}
 - or null
relatedSubjects is an array of objects: {"slug":<subject-slug>,"name":<display-name>,"confidence":<0..1>}
Subjects to prefer (slugs): maths, history, physics, computing. Key stages: ks3, ks4.
Term: ${term}`;
  return { system, user };
}

async function callModel(normalizedTerm: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const { system, user } = buildPrompt(normalizedTerm);
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!resp.ok) {
    return null;
  }
  const json = await resp.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// ASF-2 Step 2/3: Parse request and normalize; attempt model call
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IntentResponse | string>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  // Parse and normalize request
  const { term } = intentRequestSchema.parse(req.body);
  const normalized = normalizeTerm(term);
  // Expose normalized term for debugging in spike (non-contract header)
  res.setHeader("X-Normalized-Term", normalized);
  // Step 3 will try model; if unavailable, fall back in later steps
  const modelJson = await callModel(normalized);
  res.setHeader("X-Model-Used", modelJson ? "1" : "0");
  // For now, still return placeholder; subsequent steps validate/sanitize
  const payload: IntentResponse = { intent: null, relatedSubjects: [] };
  return res.status(200).json(payload);
}
