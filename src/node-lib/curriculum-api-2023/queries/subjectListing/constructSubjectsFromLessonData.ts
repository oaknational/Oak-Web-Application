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
    let { programme_slug } = lesson;
    const { lesson_slug } = lesson;

    const {
      subject,
      keystage_slug,
      phase,
      subject_slug,
      tier_slug,
      examboard_slug,
    } = lesson.programme_fields;
    const { unit_id } = lesson.unit_data;
    const originalProgrammeSlug = programme_slug;

    //remove programme factors from new data
    if (tier_slug || examboard_slug) {
      const baseProgrammeSlug = `${subject_slug}-${phase}-${keystage_slug}`;
      programme_slug = baseProgrammeSlug;
    }

    // adds all the slugs to the unitSet, lessonSet and programmeSet
    if (acc[programme_slug]) {
      acc[programme_slug]?.lessonSlugs.add(lesson_slug);
      acc[programme_slug]?.programmeSlugs.add(originalProgrammeSlug);
      acc[programme_slug]?.unitIds.add(unit_id);
    } else {
      //if the object doesn't exist, create a new object with the programme_slug as the key
      acc[programme_slug] = {
        subjectTitle: subject,
        subjectSlug: subject_slug,
        programmeSlug: programme_slug,
        unitIds: new Set([unit_id]),
        lessonSlugs: new Set([lesson_slug]),
        programmeSlugs: new Set([originalProgrammeSlug]),
      };
    }

    return acc;
  }, {} as UnprocessedSubject);

  // convert the Set to its size so it can count of unique unit_slugs, lesson_slugs and programme_slugs
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
