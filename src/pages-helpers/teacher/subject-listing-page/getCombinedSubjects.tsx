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

  const newSubject = subject.filter((s) => !isSlugLegacy(s.programmeSlug));
  const legacySubject = subject.filter((s) => isSlugLegacy(s.programmeSlug));

  // programme count is the maximum of the subject programme count
  const newSubjectProgrammeCountArray = newSubject.map((s) => s.programmeCount);
  const newSubjectMaxProgrammeCount = Math.max(
    ...newSubjectProgrammeCountArray,
  );

  const programmeCount = Math.max(
    newSubjectMaxProgrammeCount,
    legacySubject[0]?.programmeCount ?? 0,
  );

  // unit count is the sum of the subject unit count
  const newSubjectUnitCountArray = newSubject.map((s) => s.unitCount);
  const newSubjectTotalUnitCount = newSubjectUnitCountArray.reduce(
    (partialSum, a) => partialSum + a,
    0,
  );

  const unitCount = isEyfs
    ? (legacySubject[0]?.unitCount ?? 0)
    : newSubjectTotalUnitCount + (legacySubject[0]?.unitCount ?? 0);

  // lesson count is the sum of the subject lesson count
  const newSubjectLessonCountArray = newSubject.map((s) => s.lessonCount);
  const newSubjectTotalLessonCount = newSubjectLessonCountArray.reduce(
    (partialSum, a) => partialSum + a,
    0,
  );

  const lessonCount = isEyfs
    ? (legacySubject[0]?.lessonCount ?? 0)
    : newSubjectTotalLessonCount + (legacySubject[0]?.lessonCount ?? 0);

  type CombinedSubject = KeyStageSubjectData & { isNew: boolean };

  const combinedSubjectArray: CombinedSubject[] =
    newSubject.length > 0
      ? newSubject.map((newSubject) => ({
          programmeSlug: newSubject.programmeSlug,
          programmeCount,
          subjectSlug: newSubject.subjectSlug,
          subjectTitle: newSubject.subjectTitle,
          unitCount,
          lessonCount,
          pathwaySlug: newSubject.pathwaySlug,
          isNew: true,
        }))
      : legacySubject.map((legacySubject) => ({
          programmeSlug: legacySubject.programmeSlug,
          programmeCount,
          subjectSlug: legacySubject.subjectSlug,
          subjectTitle: legacySubject.subjectTitle,
          unitCount,
          lessonCount,
          pathwaySlug: legacySubject.pathwaySlug,
          isNew: false,
        }));

  return combinedSubjectArray;
};
