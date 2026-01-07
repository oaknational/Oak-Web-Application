import { ProgrammeFields, UnitData } from "@oaknational/oak-curriculum-schema";

import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

export type EYFSProgramme = {
  [programmeSlug: string]: {
    programmeFields: ProgrammeFields | null | undefined;
    units: {
      [unitSlug: string]: EYFSUnit;
    };
  };
};

type EYFSUnit = {
  unitData: UnitData;
  lessons: Array<EYFSLesson>;
};

type EYFSLesson = {
  title: string;
  slug: string;
  description?: string;
};

const eyfsListingQuery = (sdk: Sdk) => async () => {
  const res = await sdk.eyfsListing();

  const lessonSlugs = [];
  const programmes = res.lessons.reduce((acc, lesson) => {
    const programmeSlug = lesson.programme_slug;
    const unitSlug = lesson.unit_slug;

    const eyfsLesson = {
      title: lesson.lesson_data?.title ?? "",
      slug: lesson.lesson_slug ?? "",
      description:
        lesson.lesson_data?.key_learning_points?.[0]?.key_learning_point,
    };

    if (!programmeSlug || !unitSlug) {
      throw new Error("Missing data");
    }

    if (lesson.features.expired === true) {
      return acc;
    }

    lessonSlugs.push(lesson.lesson_slug);

    if (acc[programmeSlug]) {
      if (acc[programmeSlug].units[unitSlug]) {
        acc[programmeSlug].units[unitSlug].lessons.push(eyfsLesson);
      } else {
        acc[programmeSlug].units[unitSlug] = {
          lessons: [eyfsLesson],
          unitData: lesson.unit_data,
        };
      }
    } else {
      acc[programmeSlug] = {
        programmeFields: lesson.programme_fields,
        units: {
          [unitSlug]: { lessons: [eyfsLesson], unitData: lesson.unit_data },
        },
      };
    }

    return acc;
  }, {} as EYFSProgramme);

  //console.log("diego programmes", programmes);

  const videos = await sdk.eyfsVideos();

  console.log("diego videos", videos);

  return programmes;
};

export default eyfsListingQuery;
