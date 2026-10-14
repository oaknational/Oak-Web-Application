import z from "zod";

export const teachWithOakParams = z.object({
  returnTo: z.string().regex(/^\/(?!\/)/),
  lessonName: z.string(),
  unitName: z.string(),
});

/** Server-side equivalent of `getReturnToLessonProps`, for `searchParams` records. */
export const parseReturnToLessonParams = (
  searchParams: Record<string, string | string[] | undefined>,
) => {
  const parsedParams = teachWithOakParams.safeParse(searchParams);

  return parsedParams.success ? parsedParams.data : undefined;
};
