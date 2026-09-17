import z from "zod";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const teachWithOakParams = z.object({
  returnTo: z.url({ hostname: /^thenational\.academy$/ }),
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
