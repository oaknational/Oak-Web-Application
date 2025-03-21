import { pathwaySlugs } from "@oaknational/oak-curriculum-schema";

import {
  KeyStageSubjectData,
  SubjectListingPageData,
} from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

type CombinedSubject = KeyStageSubjectData & { isNew: boolean };
const pathwaySlugsArray = Object.keys(pathwaySlugs.Values);

export const getCombinedSubjects = (
  curriculumData: SubjectListingPageData,
  subjectSlug: string,
) => {
  const subject = curriculumData.subjects.filter(
    (s) => s.subjectSlug === subjectSlug,
  );

  if (!subject || subject.length === 0) {
    return null;
  }

  const newSubjectArray = subject.filter((s) => !isSlugLegacy(s.programmeSlug));
  const legacySubjectArray = subject.filter((s) =>
    isSlugLegacy(s.programmeSlug),
  );

  const getCombinedSubjectArray = () => {
    const combinedSubjectArray: CombinedSubject[] = [];
    const subjectHasPathways = !!(
      newSubjectArray[0]?.pathwaySlug ?? legacySubjectArray[0]?.pathwaySlug
    );

    switch (true) {
      case subjectHasPathways:
        pathwaySlugsArray.forEach((pathwaySlug) => {
          const newSubjectPathway = newSubjectArray.find(
            (s) => s.pathwaySlug === pathwaySlug,
          );
          const newSubjectHasPathway = !!newSubjectPathway;

          const legacySubjectPathway = legacySubjectArray.find(
            (s) => s.pathwaySlug === pathwaySlug,
          );
          const legacySubjectHasPathway = !!legacySubjectPathway;

          const newSubjectProgrammeCount =
            newSubjectPathway?.programmeCount ?? 0;
          const legacyProgrammeCount =
            legacySubjectPathway?.programmeCount ?? 0;

          const newSubjectUnitCount = newSubjectPathway?.unitCount ?? 0;
          const legacyUnitCount = legacySubjectPathway?.unitCount ?? 0;
          const totalUnitCount = newSubjectUnitCount + legacyUnitCount;

          const newSubjectLessonCount = newSubjectPathway?.lessonCount ?? 0;
          const legacyLessonCount = legacySubjectPathway?.lessonCount ?? 0;
          const totalLessonCount = newSubjectLessonCount + legacyLessonCount;

          if (newSubjectHasPathway) {
            combinedSubjectArray.push({
              programmeSlug: newSubjectPathway.programmeSlug,
              programmeCount: Math.max(
                newSubjectProgrammeCount,
                legacyProgrammeCount,
              ),
              subjectSlug: newSubjectPathway.subjectSlug,
              subjectTitle: newSubjectPathway.subjectTitle,
              unitCount: totalUnitCount,
              lessonCount: totalLessonCount,
              pathwaySlug: newSubjectPathway.pathwaySlug,
              pathwayTitle: newSubjectPathway.pathwayTitle,
              isNew: true,
              actions: newSubjectPathway.actions,
              features: newSubjectPathway.features,
            });
          } else if (legacySubjectHasPathway) {
            combinedSubjectArray.push({
              programmeSlug: legacySubjectPathway.programmeSlug,
              programmeCount: legacyProgrammeCount,
              subjectSlug: legacySubjectPathway.subjectSlug,
              subjectTitle: legacySubjectPathway.subjectTitle,
              unitCount: legacyUnitCount,
              lessonCount: legacyLessonCount,
              pathwaySlug: legacySubjectPathway.pathwaySlug,
              pathwayTitle: legacySubjectPathway.pathwayTitle,
              isNew: false,
              actions: legacySubjectPathway.actions,
              features: legacySubjectPathway.features,
            });
          }
        });
        break;
      case newSubjectArray.length > 0:
        if (newSubjectArray.length) {
          const newSubjectProgrammeCount =
            newSubjectArray[0]?.programmeCount ?? 0;
          const legacyProgrammeCount =
            legacySubjectArray[0]?.programmeCount ?? 0;

          const newSubjectUnitCount = newSubjectArray[0]?.unitCount ?? 0;
          const legacyUnitCount = legacySubjectArray[0]?.unitCount ?? 0;
          const totalUnitCount = newSubjectUnitCount + legacyUnitCount;

          const newSubjectLessonCount = newSubjectArray[0]?.lessonCount ?? 0;
          const legacyLessonCount = legacySubjectArray[0]?.lessonCount ?? 0;
          const totalLessonCount = newSubjectLessonCount + legacyLessonCount;

          newSubjectArray[0] &&
            combinedSubjectArray.push({
              programmeSlug: newSubjectArray[0].programmeSlug,
              programmeCount: Math.max(
                newSubjectProgrammeCount,
                legacyProgrammeCount,
              ),
              subjectSlug: newSubjectArray[0].subjectSlug,
              subjectTitle: newSubjectArray[0].subjectTitle,
              unitCount: totalUnitCount,
              lessonCount: totalLessonCount,
              pathwaySlug: newSubjectArray[0].pathwaySlug,
              pathwayTitle: newSubjectArray[0].pathwayTitle,
              isNew: true,
              actions: newSubjectArray[0].actions,
              features: newSubjectArray[0].features,
            });
        }
        break;
      default:
        legacySubjectArray[0] &&
          combinedSubjectArray.push({
            programmeSlug: legacySubjectArray[0].programmeSlug,
            programmeCount: legacySubjectArray[0].programmeCount,
            subjectSlug: legacySubjectArray[0].subjectSlug,
            subjectTitle: legacySubjectArray[0].subjectTitle,
            unitCount: legacySubjectArray[0].unitCount,
            lessonCount: legacySubjectArray[0].lessonCount,
            pathwaySlug: legacySubjectArray[0].pathwaySlug,
            pathwayTitle: legacySubjectArray[0].pathwayTitle,
            isNew: false,
            actions: legacySubjectArray[0].actions,
            features: legacySubjectArray[0].features,
          });
    }

    return combinedSubjectArray;
  };

  const combinedSubjectArray = getCombinedSubjectArray();

  return combinedSubjectArray;
};
