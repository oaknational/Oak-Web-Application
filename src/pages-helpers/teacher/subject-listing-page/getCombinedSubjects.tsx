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

  // unit count is the sum of the subject unit count
  const newSubjectUnitCountArray = newSubjectArray.map((s) => s.unitCount);
  const newSubjectTotalUnitCount = newSubjectUnitCountArray.reduce(
    (partialSum, a) => partialSum + a,
    0,
  );

  const unitCount = isEyfs
    ? (legacySubjectArray[0]?.unitCount ?? 0)
    : newSubjectTotalUnitCount + (legacySubjectArray[0]?.unitCount ?? 0);

  // lesson count is the sum of the subject lesson count
  const newSubjectLessonCountArray = newSubjectArray.map((s) => s.lessonCount);
  const newSubjectTotalLessonCount = newSubjectLessonCountArray.reduce(
    (partialSum, a) => partialSum + a,
    0,
  );

  const lessonCount = isEyfs
    ? (legacySubjectArray[0]?.lessonCount ?? 0)
    : newSubjectTotalLessonCount + (legacySubjectArray[0]?.lessonCount ?? 0);

  type CombinedSubject = KeyStageSubjectData & { isNew: boolean };

  const combinedSubjectArray: CombinedSubject[] =
    newSubjectArray.length > 0
      ? newSubjectArray.map((newSubject) => ({
          programmeSlug: newSubject.programmeSlug,
          programmeCount: programmeCount,
          subjectSlug: newSubject.subjectSlug,
          subjectTitle: newSubject.subjectTitle,
          unitCount: newSubject.pathwaySlug ? newSubject.unitCount : unitCount,
          lessonCount: newSubject.pathwaySlug
            ? newSubject.lessonCount
            : lessonCount,
          pathwaySlug: newSubject.pathwaySlug,
          pathwayTitle: newSubject.pathwayTitle,
          isNew: true,
        }))
      : legacySubjectArray.map((legacySubject) => ({
          programmeSlug: legacySubject.programmeSlug,
          programmeCount,
          subjectSlug: legacySubject.subjectSlug,
          subjectTitle: legacySubject.subjectTitle,
          unitCount,
          lessonCount,
          pathwaySlug: legacySubject.pathwaySlug,
          pathwayTitle: legacySubject.pathwayTitle,
          isNew: false,
        }));

  return combinedSubjectArray;
};
