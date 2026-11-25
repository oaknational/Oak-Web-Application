import { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import { cache } from "react";

import { CanonicalLessonHub } from "../CanonicalLessonHub";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { matchOakHref, resolveOakHref } from "@/common-lib/urls";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { cacheData } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";
import {
  isEyfsPathway,
  redirectToEyfsPage,
} from "@/pages-helpers/shared/lesson-pages/eyfsRedirect";

type LessonMediaHubParams = { lessonSlug: string };

const getCachedCanonicalLessonMedia = cache(
  cacheData(
    (lessonSlug: string) =>
      curriculumApi2023.canonicalLessonMedia({
        lessonSlug,
      }),
    ["canonical-lesson-media"],
  ),
);

const getCachedCanonicalRedirect = cache(
  cacheData(
    (incomingPath: string) =>
      curriculumApi2023.canonicalLessonRedirectQuery({ incomingPath }),
    ["canonical-redirect"],
  ),
);

export async function generateMetadata(
  props: AppPageProps<LessonMediaHubParams>,
): Promise<Metadata> {
  const { lessonSlug } = await props.params;

  try {
    const data = await getCachedCanonicalLessonMedia(lessonSlug);
    const title = `Lesson media hub: ${data.lessonTitle}`;
    const description = "Extra video and audio for the lesson";

    return {
      title,
      description,
      openGraph: getOpenGraphMetadata({ title, description }),
      twitter: getTwitterMetadata({ title, description }),
      robots: { index: false, follow: false },
    };
  } catch (error) {
    allowNotFoundError(error);
    return {};
  }
}

const CanonicalLessonMediaHubPage = async (
  props: AppPageProps<LessonMediaHubParams>,
) => {
  const { lessonSlug } = await props.params;
  const searchParams = await props.searchParams;
  const video = searchParams?.video;
  const clipQuery = typeof video === "string" ? { video } : undefined;

  let data;
  try {
    data = await getCachedCanonicalLessonMedia(lessonSlug);
  } catch (error) {
    allowNotFoundError(error);
  }

  if (data === undefined) {
    const { canonicalLessonRedirectData } = await getCachedCanonicalRedirect(
      `/teachers/lessons/${lessonSlug}`,
    );

    if (canonicalLessonRedirectData) {
      const { outgoingPath } = canonicalLessonRedirectData;
      const isLessonPath =
        matchOakHref(outgoingPath, "lesson-overview-canonical") ||
        matchOakHref(outgoingPath, "lesson-overview");
      const destination = isLessonPath
        ? `${outgoingPath.replace(/\/$/, "")}/media`
        : outgoingPath;
      const query = new URLSearchParams({
        ...(isLessonPath ? clipQuery : {}),
        redirected: "true",
      });
      return redirect(`${destination}?${query}`, RedirectType.replace);
    }

    return notFound();
  }

  const firstPathway = data.pathways[0];
  if (!firstPathway) {
    return notFound();
  }
  if (isEyfsPathway(firstPathway)) {
    return redirect(redirectToEyfsPage(firstPathway).destination);
  }

  const programmesForLesson = data.pathways.map((pathway) => ({
    subject: pathway.subjectTitle,
    unitTitle: pathway.unitTitle,
    examboard: pathway.examBoardTitle,
    tier: pathway.tierTitle,
    year: pathway.yearGroupTitle,
    pathway: pathway.pathwayTitle,
    href: resolveOakHref({
      page: "lesson-media",
      lessonSlug,
      unitSlug: pathway.unitSlug,
      programmeSlug: pathway.programmeSlug,
      ...(clipQuery ? { query: clipQuery } : {}),
    }),
  }));

  if (programmesForLesson.length === 1 && programmesForLesson[0]) {
    return redirect(programmesForLesson[0].href);
  }

  return (
    <CanonicalLessonHub
      subjectSlug={data.subjectSlug}
      lessonName={data.lessonTitle}
      listingTitle="Media clips appear in"
      programmesForLesson={programmesForLesson}
    />
  );
};

export default withPageErrorHandling(
  CanonicalLessonMediaHubPage,
  "canonical-lesson-media-hub::app",
);
