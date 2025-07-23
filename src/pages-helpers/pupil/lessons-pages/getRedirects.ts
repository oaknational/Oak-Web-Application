import { Redirect } from "next";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { URLParams } from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]";
import { URLParams as URLParamsCanonical } from "@/pages/teachers/lessons/[lessonSlug]";

export const getRedirect = async (
  args:
    | {
        context: URLParams;
        canonical: false; // If true, the redirect will be permanent (308), if false, temporary (307)
      }
    | {
        context: URLParamsCanonical;
        canonical: true; // If this is provided, it will be ignored
      },
): Promise<Redirect | undefined> => {
  let redirectData;
  if (args.canonical) {
    const result = await curriculumApi2023.canonicalLessonRedirectQuery({
      incomingPath: `/teachers/lessons/${args.context.lessonSlug}`,
    });
    ({ canonicalLessonRedirectData: redirectData } = result);
  } else {
    const result = await curriculumApi2023.browseLessonRedirectQuery({
      incomingPath: `/teachers/programmes/${args.context.programmeSlug}/units/${args.context.unitSlug}/lessons/${args.context.lessonSlug}`,
    });
    ({ redirectData } = result);
  }
  if (redirectData) {
    return {
      destination: `${redirectData.outgoingPath}`,
      permanent: redirectData.redirectType == "301", // true = 308, false = 307
      basePath: false, // Do not prepend the basePath
    };
  }
};
