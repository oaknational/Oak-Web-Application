import z from "zod";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const teachWithOakParams = z.object({
  returnTo: z.string().regex(/^\/(?!\/)/),
  lessonName: z.string(),
  unitName: z.string(),
});

export const getReturnToLessonProps = ({
  query,
}: {
  query: ReadonlyURLSearchParams | null;
}) => {
  if (query) {
    const parsedParams = teachWithOakParams.safeParse({
      returnTo: query.get("returnTo"),
      lessonName: query.get("lessonName"),
      unitName: query.get("unitName"),
    });
    if (parsedParams.success) {
      return parsedParams.data;
    }
  }
};

export const useReturnToLessonProps = () => {
  const query = useSearchParams();
  const props = useMemo(() => getReturnToLessonProps({ query }), [query]);

  return props;
};

/** Server-side equivalent of {@link getReturnToLessonProps}, for `searchParams` records. */
export const parseReturnToLessonParams = (
  searchParams: Record<string, string | string[] | undefined>,
) => {
  const parsedParams = teachWithOakParams.safeParse(searchParams);

  return parsedParams.success ? parsedParams.data : undefined;
};
