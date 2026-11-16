import { OakBox } from "@oaknational/oak-components";
import { notFound } from "next/navigation";
import { cache } from "react";

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

  return <OakBox>{lessonSlug}</OakBox>;
};

const CanonicalLessonHubPage = withPageErrorHandling(
  InnerCanonicalLessonHubPage,
  "canonical-lesson-hub-page::app",
);

export default CanonicalLessonHubPage;
