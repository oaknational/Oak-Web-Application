import { notFound, redirect, RedirectType } from "next/navigation";
import { cache } from "react";
import { Metadata } from "next";

import { CanonicalLessonHub } from "./CanonicalLessonHub";

import { resolveOakHref } from "@/common-lib/urls";
import { AppPageProps } from "@/hocs/withPageErrorHandling";
import { cacheData } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";

const getCachedCanonicalLesson = cache(
  cacheData(
    (lessonSlug: string) =>
      curriculumApi2023.lessonOverview({
        lessonSlug,
      }),
    ["canonical-lesson"],
  ),
);

const getCachedCanonicalRedirect = cache(
  cacheData(
    (url: string) =>
      curriculumApi2023.canonicalLessonRedirectQuery({ incomingPath: url }),
    ["canonical-redirect"],
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

const CanonicalLessonHubPage = async (
  props: AppPageProps<{ lessonSlug: string }>,
) => {
  const { lessonSlug } = await props.params;

  let data;
  try {
    data = await getCachedCanonicalLesson(lessonSlug);
  } catch (error) {
    allowNotFoundError(error);
  }

  if (!data) {
    const redirectData = await getCachedCanonicalRedirect(
      `/teachers/lessons/${lessonSlug}`,
    );

    if (redirectData.canonicalLessonRedirectData) {
      const { outgoingPath } = redirectData.canonicalLessonRedirectData;
      redirect(`${outgoingPath}?redirected=true`, RedirectType.replace);
    } else {
      return notFound();
    }
  }

  const programmesForLesson = data.pathways.map((pathway) => {
    return {
      subject: pathway.subjectTitle,
      unitTitle: pathway.unitTitle,
      examboard: pathway.examBoardTitle,
      tier: pathway.tierTitle,
      year: pathway.yearGroupTitle,
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

export default CanonicalLessonHubPage;
