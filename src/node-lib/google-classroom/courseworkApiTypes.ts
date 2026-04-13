import z from "zod";

export const createCourseWorkBodySchema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  lessonSlug: z.string(),
  programmeSlug: z.string(),
  unitSlug: z.string(),
  maxPoints: z.number().int().min(0).default(6),
});

export type CreateCourseWorkBody = z.infer<typeof createCourseWorkBodySchema>;

export const turnInBodySchema = z.object({
  assignmentToken: z.string(),
});

export type TurnInBody = z.infer<typeof turnInBodySchema>;
