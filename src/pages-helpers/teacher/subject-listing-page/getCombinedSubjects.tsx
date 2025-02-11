import {
  KeyStageSubjectData,
  SubjectListingPageData,
} from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export const getCombinedSubjects = (
  curriculumData: SubjectListingPageData,
  subjectSlug: string,
  isEyfs: boolean,
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

  // programme count is the maximum of the subject programme count
  const newSubjectProgrammeCountArray = newSubjectArray.map(
    (s) => s.programmeCount,
  );
  const newSubjectMaxProgrammeCount = Math.max(
    ...newSubjectProgrammeCountArray,
  );

  const programmeCount = Math.max(
    newSubjectMaxProgrammeCount,
    legacySubjectArray[0]?.programmeCount ?? 0,
  );

  const getLegacySubjectUnitCount = (
    pathwaySlug: string | null,
    legacySubjectArray: KeyStageSubjectData[],
  ) => {
    return (
      legacySubjectArray.find(
        (legacySubject) => legacySubject.pathwaySlug === pathwaySlug,
      )?.unitCount ?? 0
    );
  };

  const getLegacySubjectLessonCount = (
    pathwaySlug: string | null,
    legacySubjectArray: KeyStageSubjectData[],
  ) => {
    return (
      legacySubjectArray.find(
        (legacySubject) => legacySubject.pathwaySlug === pathwaySlug,
      )?.lessonCount ?? 0
    );
  };

  type CombinedSubject = KeyStageSubjectData & { isNew: boolean };

  const compareByPathway = (a: CombinedSubject, b: CombinedSubject) => {
    const pathwaySlugA = a.pathwaySlug;
    const pathwaySlugB = b.pathwaySlug;

    if (pathwaySlugA && pathwaySlugB) {
      if (pathwaySlugA < pathwaySlugB) {
        return -1;
      }
      if (pathwaySlugA > pathwaySlugB) {
        return 1;
      }
    }
    return 0;
  };

  const combinedSubjectArray: CombinedSubject[] =
    newSubjectArray.length > 0
      ? newSubjectArray
          .map((newSubject) => {
            const eyfsUnitCount = legacySubjectArray[0]?.unitCount ?? 0;
            const eyfsLessonCount = legacySubjectArray[0]?.lessonCount ?? 0;

            const legacyPathwayUnitCount = getLegacySubjectUnitCount(
              newSubject.pathwaySlug,
              legacySubjectArray,
            );
            const totalPathwayUnitCount =
              newSubject.unitCount + legacyPathwayUnitCount;

            const legacyPathwayLessonCount = getLegacySubjectLessonCount(
              newSubject.pathwaySlug,
              legacySubjectArray,
            );
            const totalPathwayLessonCount =
              newSubject.lessonCount + legacyPathwayLessonCount;

            return {
              programmeSlug: newSubject.programmeSlug,
              programmeCount: programmeCount,
              subjectSlug: newSubject.subjectSlug,
              subjectTitle: newSubject.subjectTitle,
              unitCount: isEyfs ? eyfsUnitCount : totalPathwayUnitCount,
              lessonCount: isEyfs ? eyfsLessonCount : totalPathwayLessonCount,
              pathwaySlug: newSubject.pathwaySlug,
              pathwayTitle: newSubject.pathwayTitle,
              isNew: true,
              actions: newSubject.actions,
            };
          })
          .sort(compareByPathway)
      : legacySubjectArray
          .map((legacySubject) => ({
            programmeSlug: legacySubject.programmeSlug,
            programmeCount,
            subjectSlug: legacySubject.subjectSlug,
            subjectTitle: legacySubject.subjectTitle,
            unitCount: legacySubject.unitCount,
            lessonCount: legacySubject.lessonCount,
            pathwaySlug: legacySubject.pathwaySlug,
            pathwayTitle: legacySubject.pathwayTitle,
            isNew: false,
            actions: legacySubject.actions,
          }))
          .sort(compareByPathway);

  return combinedSubjectArray;
};
