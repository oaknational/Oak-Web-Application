import { Redirect } from "next";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { URLParams } from "@/pages/teachers/specialist/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]";

export const getRedirect = async (
  context: URLParams,
): Promise<Redirect | undefined> => {
  const { redirectData } = await curriculumApi2023.browseLessonRedirectQuery({
    incomingPath: `/teachers/programmes/${context.programmeSlug}/units/${context.unitSlug}/lessons/${context.lessonSlug}`,
  });
  if (redirectData) {
    return {
      destination: `${redirectData.outgoingPath}`,
      permanent: redirectData.redirectType == "301", // true = 308, false = 307
      basePath: false, // Do not prepend the basePath
    };
  } else {
    return undefined;
  }
};
