import {
  subjects,
  subjectSlugs,
  SyntheticUnitvariantsWithLessonIdsByKs,
} from "@oaknational/oak-curriculum-schema";

interface UnprocessedSubject {
  [key: string]: {
    subjectTitle: typeof subjects | string;
    subjectSlug: typeof subjectSlugs | string;
    programmeSlug: string;
    unitIds: Set<number>;
    lessonIds: Set<number>;
    programmeSlugs: Set<string>;
    pathwaySlug: "core" | "gcse" | null;
    pathwayTitle: "Core" | "GCSE" | null;
  };
}

interface ProcessedSubject {
  subjectTitle: typeof subjects | string;
  subjectSlug: typeof subjectSlugs | string;
  programmeSlug: string;
  unitCount: number;
  lessonCount: number;
  programmeCount: number;
  pathwaySlug: "core" | "gcse" | null;
  pathwayTitle: "Core" | "GCSE" | null;
}

export const constructSubjectsFromUnitData = (
  units: SyntheticUnitvariantsWithLessonIdsByKs[],
): ProcessedSubject[] => {
  const subjects = units.reduce((acc, unit) => {
    let { programme_slug } = unit;
    const { unit_data, lesson_ids } = unit;

    const {
      subject,
      keystage_slug,
      phase,
      subject_slug,
      tier_slug,
      examboard_slug,
      pathway_slug,
      pathway,
    } = unit.programme_fields;
    const { unit_id } = unit_data;
    const originalProgrammeSlug = programme_slug;

    //remove programme factors from new data
    if (tier_slug || examboard_slug) {
      const baseProgrammeSlug = `${subject_slug}-${phase}-${keystage_slug}`;
      programme_slug = baseProgrammeSlug;
    }

    // adds all the slugs to the unitSet, lessonSet and programmeSet
    if (acc[programme_slug]) {
      if (lesson_ids)
        lesson_ids.forEach((lesson_id) => {
          acc[programme_slug]?.lessonIds.add(lesson_id);
        });
      acc[programme_slug]?.programmeSlugs.add(originalProgrammeSlug);
      acc[programme_slug]?.unitIds.add(unit_id);
    } else {
      //if the object doesn't exist, create a new object with the programme_slug as the key
      acc[programme_slug] = {
        subjectTitle: subject,
        subjectSlug: subject_slug,
        programmeSlug: programme_slug,
        unitIds: new Set([unit_id]),
        lessonIds: new Set(lesson_ids),
        programmeSlugs: new Set([originalProgrammeSlug]),
        pathwaySlug: pathway_slug,
        pathwayTitle: pathway,
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
      lessonCount: subject.lessonIds.size,
      programmeCount: subject.programmeSlugs.size,
      pathwaySlug: subject.pathwaySlug,
      pathwayTitle: subject.pathwayTitle,
    }),
  );

  return processedSubjects;
};
