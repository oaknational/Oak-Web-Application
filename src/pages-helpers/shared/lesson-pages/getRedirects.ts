import { Redirect } from "next";

import { PupilLessonPageURLParams } from "../../pupil/lessons-pages/getProps";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { URLParams } from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]";
import { URLParams as URLParamsCanonical } from "@/pages/teachers/lessons/[lessonSlug]";
import { URLParams as UnitURLParams } from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import { PupilLessonListingURLParams } from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons";

export const getRedirect = async (
  args:
    | {
        isTeacher: boolean;
        isLesson: true;
        context: URLParams | PupilLessonPageURLParams;
        isCanonical: false; // If true, the redirect will be permanent (308), if false, temporary (307)
      }
    | {
        isTeacher: boolean;
        isLesson: true;
        context: URLParamsCanonical | PupilLessonPageURLParams;
        isCanonical: true; // If this is provided, it will be ignored
      }
    | {
        isTeacher: boolean;
        isLesson: false;
        context: UnitURLParams | PupilLessonListingURLParams;
        isCanonical: false; // If true, the redirect will be permanent (308), if false, temporary (307)
      },
): Promise<Redirect | undefined> => {
  const redirectData = await (async () => {
    switch (true) {
      case args.isLesson && args.isCanonical && args.isTeacher: {
        const result = await curriculumApi2023.canonicalLessonRedirectQuery({
          incomingPath: `/teachers/lessons/${args.context.lessonSlug}`,
        });
        return result.canonicalLessonRedirectData;
      }
      case args.isLesson && !args.isCanonical && args.isTeacher: {
        const result = await curriculumApi2023.browseLessonRedirectQuery({
          incomingPath: `/teachers/programmes/${args.context.programmeSlug}/units/${args.context.unitSlug}/lessons/${args.context.lessonSlug}`,
        });
        return result.redirectData;
      }
      case !args.isLesson && !args.isCanonical && args.isTeacher: {
        const result = await curriculumApi2023.browseUnitRedirectQuery({
          incomingPath: `/teachers/programmes/${args.context.programmeSlug}/units/${args.context.unitSlug}/lessons`,
        });
        return result.browseUnitRedirectData;
      }
      case args.isLesson && args.isCanonical && !args.isTeacher: {
        const result =
          await curriculumApi2023.pupilCanonicalLessonRedirectQuery({
            incomingPath: `/pupils/lessons/${args.context.lessonSlug}`,
          });
        return result.pupilCanonicalLessonRedirectData;
      }
      case args.isLesson && !args.isCanonical && !args.isTeacher: {
        const result = await curriculumApi2023.pupilBrowseLessonRedirectQuery({
          incomingPath: `/pupils/programmes/${args.context.programmeSlug}/units/${args.context.unitSlug}/lessons/${args.context.lessonSlug}`,
        });
        return result.pupilBrowseLessonRedirectData;
      }
      case !args.isLesson && !args.isCanonical && !args.isTeacher: {
        const result = await curriculumApi2023.pupilUnitRedirectQuery({
          incomingPath: `/pupils/programmes/${args.context.programmeSlug}/units/${args.context.unitSlug}/lessons`,
        });
        return result.pupilUnitRedirectData;
      }
    }
  })();

  if (redirectData) {
    return {
      destination: `${redirectData.outgoingPath}?redirected=true`,
      statusCode: redirectData.redirectType, // true = 308, false = 307
      basePath: false, // Do not prepend the basePath
    };
  }
};
