import { OakCard } from "@oaknational/oak-components";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { resolveOakHref } from "@/common-lib/urls";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

type MaybeTeachWithOakCardProps = {
  /** Path to send the teacher back to from the Teach with Oak page */
  returnTo: string;
};

/** Renders nothing unless the `teachers-teach-with-oak` flag is on the `teacher-tip` variant. */
export function MaybeTeachWithOakCard({
  returnTo,
}: Readonly<MaybeTeachWithOakCardProps>) {
  const shouldShowCard =
    useFeatureFlagVariantKey("teachers-teach-with-oak") === "teacher-tip";

  if (!shouldShowCard) return null;

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
