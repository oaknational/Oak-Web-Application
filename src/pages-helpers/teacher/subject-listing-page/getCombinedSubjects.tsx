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

  const legacySubjectUnitCount = legacySubjectArray[0]?.unitCount ?? 0;
  const legacySubjectLessonCount = legacySubjectArray[0]?.lessonCount ?? 0;

  type CombinedSubject = KeyStageSubjectData & { isNew: boolean };

  const combinedSubjectArray: CombinedSubject[] =
    newSubjectArray.length > 0
      ? newSubjectArray.map((newSubject) => ({
          programmeSlug: newSubject.programmeSlug,
          programmeCount: programmeCount,
          subjectSlug: newSubject.subjectSlug,
          subjectTitle: newSubject.subjectTitle,
          unitCount: isEyfs
            ? legacySubjectUnitCount
            : newSubject.unitCount + legacySubjectUnitCount,
          lessonCount: isEyfs
            ? legacySubjectLessonCount
            : newSubject.lessonCount + legacySubjectLessonCount,
          pathwaySlug: newSubject.pathwaySlug,
          pathwayTitle: newSubject.pathwayTitle,
          isNew: true,
        }))
      : legacySubjectArray.map((legacySubject) => ({
          programmeSlug: legacySubject.programmeSlug,
          programmeCount,
          subjectSlug: legacySubject.subjectSlug,
          subjectTitle: legacySubject.subjectTitle,
          unitCount: legacySubject.unitCount,
          lessonCount: legacySubject.lessonCount,
          pathwaySlug: legacySubject.pathwaySlug,
          pathwayTitle: legacySubject.pathwayTitle,
          isNew: false,
        }));

  return combinedSubjectArray;
};
