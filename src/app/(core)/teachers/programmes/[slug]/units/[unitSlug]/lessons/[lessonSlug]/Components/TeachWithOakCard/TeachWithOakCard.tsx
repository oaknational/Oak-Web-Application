import { OakBox, OakCard } from "@oaknational/oak-components";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { resolveOakHref, TeachWithOakQueryProps } from "@/common-lib/urls";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

/** Renders nothing unless the `teachers-teach-with-oak` flag is on the `teacher-tip` variant. */
export function MaybeTeachWithOakCard(query: Readonly<TeachWithOakQueryProps>) {
  const { teachWithOakAccessed } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );
  const shouldShowCard =
    useFeatureFlagVariantKey("teachers-teach-with-oak") === "teacher-tip";

  if (!shouldShowCard) return null;

  const href = resolveOakHref({
    page: "teach-with-oak",
    query,
  });

  return (
    <OakBox onClick={teachWithOakAccessed}>
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
    </OakBox>
  );
}
