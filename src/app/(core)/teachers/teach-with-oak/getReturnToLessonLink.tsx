import z from "zod";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const teachWithOakParams = z.object({
  returnTo: z.url({ hostname: /^thenational\.academy$/ }),
});

export const getReturnToLessonLink = ({
  query,
}: {
  query: ReadonlyURLSearchParams | null;
}) => {
  if (query) {
    const parsedParams = teachWithOakParams.safeParse({
      returnTo: query.get("returnTo"),
    });
    if (parsedParams.success) {
      const { returnTo } = parsedParams.data;
      return returnTo;
    }
  }
};

export const useReturnToLessonLink = () => {
  const query = useSearchParams();
  const href = useMemo(() => getReturnToLessonLink({ query }), [query]);

  return href;
};
