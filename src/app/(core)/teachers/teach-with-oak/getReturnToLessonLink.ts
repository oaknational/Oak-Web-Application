import z from "zod";

import { PageSearchParms } from "../programmes/[slug]/[tab]/page";

export const teachWithOakParams = z.object({
  returnTo: z.url({ hostname: /^thenational\.academy$/ }),
});

export const getReturnToLessonLink = ({
  query,
}: {
  query?: PageSearchParms;
}) => {
  if (query) {
    const parsedParams = teachWithOakParams.safeParse(query);
    if (parsedParams.success) {
      const { returnTo } = parsedParams.data;
      return returnTo;
    }
  }
};
