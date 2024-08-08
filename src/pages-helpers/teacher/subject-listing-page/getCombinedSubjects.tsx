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

  const newSubject = subject.find((s) => !isSlugLegacy(s.programmeSlug));
  const legacySubject = subject.find((s) => isSlugLegacy(s.programmeSlug));

  const programmeCount = Math.max(
    newSubject?.programmeCount ?? 0,
    legacySubject?.programmeCount ?? 0,
  );
  const unitCount = isEyfs
    ? legacySubject!.unitCount
    : (newSubject?.unitCount ?? 0) + (legacySubject?.unitCount ?? 0);
  const lessonCount = isEyfs
    ? legacySubject!.lessonCount
    : (newSubject?.lessonCount ?? 0) + (legacySubject?.lessonCount ?? 0);

  const combinedSubject: KeyStageSubjectData & { isNew: boolean } = {
    programmeSlug: newSubject?.programmeSlug ?? legacySubject!.programmeSlug,
    programmeCount,
    subjectSlug: newSubject?.subjectSlug ?? legacySubject!.subjectSlug,
    subjectTitle: newSubject?.subjectTitle ?? legacySubject!.subjectTitle,
    unitCount,
    lessonCount,
    isNew: !!newSubject,
  };

  return combinedSubject;
};
