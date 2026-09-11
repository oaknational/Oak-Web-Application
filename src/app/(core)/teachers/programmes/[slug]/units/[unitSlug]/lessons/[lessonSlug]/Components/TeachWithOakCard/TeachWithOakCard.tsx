import { OakCard } from "@oaknational/oak-components";
// import { useFeatureFlagVariantKey } from "posthog-js/react";

import { resolveOakHref } from "@/common-lib/urls";
import getAppBaseUrl from "@/common-lib/urls/getAppBaseUrl";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getLessonSlugFromProgrammeState } from "@/context/TeacherBrowseAnalytics/utils/getLessonSlugFromProgrammeState";

/** Renders nothing unless the `teachers-teach-with-oak` flag is on the `teacher-tip` variant. */
export function MaybeTeachWithOakCard() {
  // const shouldShowCard =
  //   useFeatureFlagVariantKey("teachers-teach-with-oak") === "teacher-tip";
  const shouldShowCard = true;

  const programmeState = useTeacherBrowseAnalytics((s) => s.programmeState);
  const lessonSlug = getLessonSlugFromProgrammeState(programmeState);

  if (
    !shouldShowCard ||
    programmeState?.browseLevel !== "lesson" ||
    !lessonSlug
  )
    return null;

  const lessonHref = resolveOakHref({
    page: "lesson-overview",
    lessonSlug,
    programmeSlug: programmeState.programmeSlug,
    unitSlug: programmeState.unit.slug,
  });

  const returnTo = new URL(lessonHref, getAppBaseUrl()).toString();
  console.log({ returnTo });
  const href = resolveOakHref({
    page: "teach-with-oak",
    query: {
      returnTo,
    },
  });

  return (
    <OakCard
      $background={"bg-decorative2-main"}
      $btr={"border-radius-square"}
      aspectRatio="1/1"
      heading="Ever wondered why our lessons are structured this way?"
      subCopy="See how explanation, checks for understanding, practice and feedback work together to support pupils' learning."
      href={href}
      linkIconName="arrow-right"
      linkText="See the thinking behind Oak lessons"
      imageBackgroundColor="bg-decorative2-very-subdued"
      hoverBackground="bg-decorative2-main"
      imageSrc={getCloudinaryImageUrl(
        "v1788962879/teacher-journey/Teachwithoak_image_gukwk3.svg",
      )}
      cardOrientation={["column", "row", "row"]}
    />
  );
}
