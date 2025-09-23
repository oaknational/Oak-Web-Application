import { z } from "zod";

/**
 * Shared schemas and helpers for the AI "suggested filters" spike.
 *
 * Contracts
 * - Request: { term: string } — trimmed, min length 2
 * - Response: { intent, relatedSubjects[] } with confidences in [0,1]
 *
 * Usage (API route)
 *  const { term } = parseIntentRequest(req.body);
 *  const normalized = normalizeTerm(term);
 *  // call model or fallback
 *  const parsed = parseIntentResponse(responseJson);
 *
 * Usage (client/hook)
 *  import { intentResponseSchema } from "@/context/Search/ai-suggested-filters.schema";
 *  const data = await fetch(...).then(r => r.json());
 *  const { intent, relatedSubjects } = intentResponseSchema.parse(data);
 */

// Request schema: accepts a trimmed term with minimum length 2
/**
 * Request schema for POST /api/search/intent
 * - Trims incoming term and enforces a minimum length of 2
 */
export const intentRequestSchema = z.object({
  term: z.string().trim().min(2),
});

// Related subject suggestion item with confidence bounded between 0 and 1
/**
 * Related subject suggestion item
 * - slug: subject slug (e.g., "maths")
 * - name: display name (e.g., "Maths")
 * - confidence: 0–1 inclusive
 */
export const relatedSubjectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  confidence: z.number().min(0).max(1),
});

// Intent union covering subject, subject+keystage, and topic
/**
 * Inferred user intent from a search term
 * - subject: a subject only
 * - subject-keystage: a subject and key stage
 * - topic: a topic name (UI ignores for MVP but kept in payload)
 */
export const intentSchema = z
  .union([
    z.object({
      type: z.literal("subject"),
      subject: z.string(),
      confidence: z.number().min(0).max(1),
    }),
    z.object({
      type: z.literal("subject-keystage"),
      subject: z.string(),
      keyStage: z.string(),
      confidence: z.number().min(0).max(1),
    }),
    z.object({
      type: z.literal("topic"),
      topic: z.string(),
      confidence: z.number().min(0).max(1),
    }),
  ])
  .nullable();

// Response schema: intent and up to 5 related subjects
/**
 * Response schema returned by the API endpoint
 * - intent: nullable union above
 * - relatedSubjects: at most 5 items
 */
export const intentResponseSchema = z.object({
  intent: intentSchema,
  relatedSubjects: z.array(relatedSubjectSchema).max(5),
});

// Types for consumers
/** Type aliases for consumer convenience */
export type IntentRequest = z.infer<typeof intentRequestSchema>;
export type RelatedSubject = z.infer<typeof relatedSubjectSchema>;
export type Intent = z.infer<typeof intentSchema>;
export type IntentResponse = z.infer<typeof intentResponseSchema>;

// Helpers
/** Normalize a raw search term: trim, collapse spaces, lowercase */
export const normalizeTerm = (s: string) =>
  s.trim().replace(/\s+/g, " ").toLowerCase();

/** Zod-parse helper for request objects */
export function parseIntentRequest(data: unknown): IntentRequest {
  return intentRequestSchema.parse(data);
}

/** Zod-parse helper for response objects */
export function parseIntentResponse(data: unknown): IntentResponse {
  return intentResponseSchema.parse(data);
}

/** Safe-parse variant for response objects */
export function safeParseIntentResponse(data: unknown) {
  return intentResponseSchema.safeParse(data);
}

// Minimal MVP whitelists (spike)
/** Minimal MVP subject whitelist used for server-side filtering */
export const SUBJECT_WHITELIST = [
  "maths",
  "history",
  "physics",
  "computing",
  "art",
  "drama",
  "pe",
  "music",
  "english",
  "geography",
  "chemistry",
  "biology",
  "religious-education",
  "design-and-technology",
  "modern-foreign-languages",
  "business-studies",
  "psychology",
  "economics",
  "citizenship",
  "media-studies",
  "physical-education",
] as const;
export type SubjectSlug = (typeof SUBJECT_WHITELIST)[number];

/** Minimal MVP key stage whitelist used for server-side filtering */
export const KEY_STAGE_WHITELIST = ["ks1", "ks2", "ks3", "ks4"] as const;
export type KeyStageSlug = (typeof KEY_STAGE_WHITELIST)[number];
