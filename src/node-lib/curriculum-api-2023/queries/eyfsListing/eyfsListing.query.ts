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
  video: {
    muxPlaybackId: string | null;
    title: string | null;
  };
};

const eyfsListingQuery = (sdk: Sdk) => async () => {
  const res = await sdk.eyfsListing();

  const lessonSlugs = res.lessons
    .map((lesson) => lesson.lesson_slug)
    .filter((slug) => !!slug) as string[];
  const videos = await sdk.eyfsVideos({ lessonIds: lessonSlugs });

  const programmes = res.lessons.reduce((acc, lesson) => {
    const programmeSlug = lesson.programme_slug;
    const unitSlug = lesson.unit_slug;

    const video = videos.published_mv_lesson_content_published_9_0_0.find(
      (v) => v.video_id === lesson.lesson_data.video_id,
    );

    const eyfsLesson: EYFSLesson = {
      title: lesson.lesson_data?.title ?? "",
      slug: lesson.lesson_slug ?? "",
      description:
        lesson.lesson_data?.key_learning_points?.[0]?.key_learning_point,
      video: {
        muxPlaybackId: video?.video_mux_playback_id ?? null,
        title: video?.video_title ?? null,
      },
    };

    if (!programmeSlug || !unitSlug) {
      throw new Error("Missing data");
    }

    if (lesson.features.expired === true) {
      return acc;
    }

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

  return programmes;
};

export default eyfsListingQuery;
