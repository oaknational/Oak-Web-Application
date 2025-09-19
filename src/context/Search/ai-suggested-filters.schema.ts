import { z } from "zod";

// Request schema: accepts a trimmed term with minimum length 2
export const intentRequestSchema = z.object({
  term: z.string().trim().min(2),
});

// Related subject suggestion item with confidence bounded between 0 and 1
export const relatedSubjectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  confidence: z.number().min(0).max(1),
});

// Intent union covering subject, subject+keystage, and topic
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
export const intentResponseSchema = z.object({
  intent: intentSchema,
  relatedSubjects: z.array(relatedSubjectSchema).max(5),
});

// Types for consumers
export type IntentRequest = z.infer<typeof intentRequestSchema>;
export type RelatedSubject = z.infer<typeof relatedSubjectSchema>;
export type Intent = z.infer<typeof intentSchema>;
export type IntentResponse = z.infer<typeof intentResponseSchema>;

// Helpers
export const normalizeTerm = (s: string) =>
  s.trim().replace(/\s+/g, " ").toLowerCase();

export function parseIntentRequest(data: unknown): IntentRequest {
  return intentRequestSchema.parse(data);
}

export function parseIntentResponse(data: unknown): IntentResponse {
  return intentResponseSchema.parse(data);
}

export function safeParseIntentResponse(data: unknown) {
  return intentResponseSchema.safeParse(data);
}

// Minimal MVP whitelists (spike)
export const SUBJECT_WHITELIST = [
  "maths",
  "history",
  "physics",
  "computing",
] as const;
export type SubjectSlug = (typeof SUBJECT_WHITELIST)[number];

export const KEY_STAGE_WHITELIST = ["ks3", "ks4"] as const;
export type KeyStageSlug = (typeof KEY_STAGE_WHITELIST)[number];
