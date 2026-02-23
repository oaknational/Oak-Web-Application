import {
  queryResponse,
  EyfsUnits,
  EyfsPageData,
  videoResponseSchema,
  EYFSLesson,
} from "./eyfsSchema";

import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import OakError from "@/errors/OakError";

const eyfsPageQuery = (sdk: Sdk) => async (args: { subjectSlug: string }) => {
  const res = await sdk.eyfsPage(args);

  if (!res.lessons || res.lessons.length === 0) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const parsedResponse = queryResponse.parse(res);

  const subjectTitle = parsedResponse.lessons[0]?.programme_fields.subject;

  if (!subjectTitle) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const lessonSlugs = parsedResponse.lessons.map((l) => l.lesson_slug);
  const videos = await sdk.eyfsVideos({ lessonIds: lessonSlugs });

  const parsedVideos = videoResponseSchema.parse(videos);

  const units = parsedResponse.lessons.reduce((acc, lesson) => {
    const unitSlug = lesson.unit_slug;

    const video = parsedVideos.videos.find(
      (v) => v.video_id === lesson.lesson_data.video_id,
    );

    const eyfsLesson: EYFSLesson = {
      title: lesson.lesson_data?.title,
      slug: lesson.lesson_slug,
      description:
        lesson.lesson_data?.key_learning_points?.[0]?.key_learning_point,
      orderInUnit: lesson.order_in_unit,
      video: {
        muxPlaybackId: video?.video_mux_playback_id ?? null,
        title: video?.video_title ?? null,
      },
    };

    if (lesson.features.expired === true) {
      return acc;
    }

    if (acc[unitSlug]) {
      acc[unitSlug].lessons.push(eyfsLesson);
    } else {
      acc[unitSlug] = {
        lessons: [eyfsLesson],
        title: lesson.unit_data.title,
      };
    }

    return acc;
  }, {} as EyfsUnits);

  const subjectTabs = parsedResponse.subjects.map((s) => ({
    slug: s.subject_slug,
    title: s.subject_title,
  }));

  return { subjectTitle, units, subjectTabs } as EyfsPageData;
};

export default eyfsPageQuery;
