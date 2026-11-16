import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { Metadata } from "next";

import { CanonicalLessonHub } from "./CanonicalLessonHub";

import { resolveOakHref } from "@/common-lib/urls";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { cacheData } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";

const getCachedCanonicalLesson = cache(
  cacheData(
    (lessonSlug: string) =>
      curriculumApi2023.lessonOverview({
        lessonSlug,
      }),
    ["canonical-lesson"],
  ),
);

export async function generateMetadata(
  props: AppPageProps<{ lessonSlug: string }>,
): Promise<Metadata> {
  const { lessonSlug } = await props.params;
  try {
    const data = await getCachedCanonicalLesson(lessonSlug);
    const title = `Lesson hub: ${data.lessonTitle}`;
    const description =
      "View lesson content and choose resources to download or share";

    return {
      title,
      description,
      openGraph: getOpenGraphMetadata({ title, description }),
      twitter: getTwitterMetadata({ title, description }),
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {};
  }
}

const InnerCanonicalLessonHubPage = async (
  props: AppPageProps<{ lessonSlug: string }>,
) => {
  const { lessonSlug } = await props.params;

  const data = await getCachedCanonicalLesson(lessonSlug);

  if (!data) {
    return notFound();
  }

  const programmesForLesson = data.pathways.map((pathway) => {
    return {
      subject: pathway.subjectTitle,
      unitTitle: pathway.unitTitle,
      examboard: pathway.examBoardTitle,
      tier: pathway.tierTitle,
      year: data.yearTitle,
      pathway: pathway.pathwayTitle,
      href: resolveOakHref({
        page: "lesson-overview",
        lessonSlug,
        unitSlug: pathway.unitSlug,
        programmeSlug: pathway.programmeSlug,
      }),
    };
  });

  if (programmesForLesson.length === 1 && programmesForLesson[0]) {
    return redirect(programmesForLesson[0]?.href);
  }

  return (
    <CanonicalLessonHub
      subjectSlug={data.subjectSlug}
      lessonName={data.lessonTitle}
      programmesForLesson={programmesForLesson}
    />
  );
};

const CanonicalLessonHubPage = withPageErrorHandling(
  InnerCanonicalLessonHubPage,
  "canonical-lesson-hub-page::app",
);

export default CanonicalLessonHubPage;
