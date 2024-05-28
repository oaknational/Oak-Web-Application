import {
  subjects,
  subjectSlugs,
  SyntheticUnitvariantLessons,
} from "@oaknational/oak-curriculum-schema";

interface UnprocessedSubject {
  [key: string]: {
    subjectTitle: typeof subjects | string;
    subjectSlug: typeof subjectSlugs | string;
    programmeSlug: string;
    unitIds: Set<number>;
    lessonSlugs: Set<string>;
    programmeSlugs: Set<string>;
  };
}

interface ProcessedSubject {
  subjectTitle: typeof subjects | string;
  subjectSlug: typeof subjectSlugs | string;
  programmeSlug: string;
  unitCount: number;
  lessonCount: number;
  programmeCount: number;
}

export const constructSubjectsFromLessonData = (
  lessons: SyntheticUnitvariantLessons[],
): ProcessedSubject[] => {
  const subjects = lessons.reduce((acc, lesson) => {
    const { lesson_slug } = lesson;
    const { subject, keystage_slug, phase, subject_slug } =
      lesson.programme_fields;
    const { unit_id } = lesson.unit_data;
    const baseProgrammeSlug = `${subject_slug}-${phase}-${keystage_slug}`;

    if (acc[baseProgrammeSlug]) {
      acc[baseProgrammeSlug]?.lessonSlugs.add(lesson_slug);
      acc[baseProgrammeSlug]?.programmeSlugs.add(baseProgrammeSlug);
      acc[baseProgrammeSlug]?.unitIds.add(unit_id);
    } else {
      acc[baseProgrammeSlug] = {
        subjectTitle: subject,
        subjectSlug: subject_slug,
        programmeSlug: baseProgrammeSlug,
        unitIds: new Set([unit_id]),
        lessonSlugs: new Set([lesson_slug]),
        programmeSlugs: new Set([baseProgrammeSlug]),
      };
    }

    return acc;
  }, {} as UnprocessedSubject);

  const processedSubjects: ProcessedSubject[] = Object.values(subjects).map(
    (subject) => ({
      subjectTitle: subject.subjectTitle,
      subjectSlug: subject.subjectSlug,
      programmeSlug: subject.programmeSlug,
      unitCount: subject.unitIds.size,
      lessonCount: subject.lessonSlugs.size,
      programmeCount: subject.programmeSlugs.size,
    }),
  );

  return processedSubjects;
};
