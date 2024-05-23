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

export const processLessons = (
  lessons: SyntheticUnitvariantLessons[],
): ProcessedSubject[] => {
  const subjects = {} as UnprocessedSubject;

  for (const lesson of lessons) {
    // eslint-disable-next-line prefer-const
    let { programme_slug, lesson_slug } = lesson;
    const { subject, keystage_slug, tier_slug, examboard_slug } =
      lesson.programme_fields;
    const { unit_id } = lesson.unit_data;
    const newProgrammeSlug = programme_slug;
    // If there's a tier_slug or examboard_slug, slice the programme_slug after the keystage_slug
    if (tier_slug || examboard_slug) {
      const components = programme_slug.split("-");
      const index = components.indexOf(keystage_slug);
      programme_slug = components.slice(0, index + 1).join("-");
    }

    // adds all the slugs to the unitSet, lessonSet and programmeSet
    if (subjects[programme_slug]) {
      subjects[programme_slug]?.lessonSlugs.add(lesson_slug);
      subjects[programme_slug]?.programmeSlugs.add(newProgrammeSlug);
      subjects[programme_slug]?.unitIds.add(unit_id);
    } else {
      //if the object doesn't exist, create a new object with the programme_slug as the key
      subjects[programme_slug] = {
        subjectTitle: subject,
        subjectSlug: lesson.programme_fields.subject_slug,
        programmeSlug: programme_slug,
        unitIds: new Set([unit_id]),
        lessonSlugs: new Set([lesson_slug]),
        programmeSlugs: new Set([newProgrammeSlug]),
      };
    }
  }

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
