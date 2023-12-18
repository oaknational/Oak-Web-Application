import { z } from "zod";

const keyStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortCode: z.string(),
  displayOrder: z.number().optional(),
});

const subjectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional(),
});

const examBoardSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional(),
});

const contentTypesSchema = z.object({
  slug: z.union([z.literal("unit"), z.literal("lesson")]),
  title: z.union([z.literal("Units"), z.literal("Lessons")]),
});

const searchPageSchema = z.object({
  keyStages: z.array(keyStageSchema),
  subjects: z.array(subjectSchema),
  contentTypes: z.array(contentTypesSchema),
  examBoards: z.array(examBoardSchema),
});

export type SearchPageData = z.infer<typeof searchPageSchema>;
export default searchPageSchema;
