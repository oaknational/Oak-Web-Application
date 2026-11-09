import { LessonMediaClipsData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { cacheData } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getCopyrightRestrictionForSubject } from "@/utils/getCopyrightRestrictionForSubject";

export const getCachedLessonMediaClipsData = cacheData(
  async (programmeSlug: string, unitSlug: string, lessonSlug: string) => {
    return curriculumApi2023.lessonMediaClips<LessonMediaClipsData>({
      programmeSlug,
      unitSlug,
      lessonSlug,
    });
  },
  ["lesson-media-clips"],
);

export const getLessonMediaRestriction = (data: LessonMediaClipsData) => {
  const { resourceIsGeorestricted, resourceRequiresLogin } =
    getCopyrightRestrictionForSubject({
      subjectSlug: data.subjectSlug,
      geoRestricted: data.geoRestricted,
      loginRequired: data.loginRequired,
    });

  return {
    isGeoRestricted: resourceIsGeorestricted,
    isRestricted: resourceIsGeorestricted || resourceRequiresLogin,
  };
};
