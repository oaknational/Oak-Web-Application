import { OakBox } from "@oaknational/oak-components";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { resolveOakHref } from "@/common-lib/urls";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { cacheData } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const getCachedCanonicalLesson = cache(
  cacheData(
    (lessonSlug: string) =>
      curriculumApi2023.lessonOverview({
        lessonSlug,
      }),
    ["canonical-lesson"],
  ),
);

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

  return <OakBox />;
};

const CanonicalLessonHubPage = withPageErrorHandling(
  InnerCanonicalLessonHubPage,
  "canonical-lesson-hub-page::app",
);

export default CanonicalLessonHubPage;
