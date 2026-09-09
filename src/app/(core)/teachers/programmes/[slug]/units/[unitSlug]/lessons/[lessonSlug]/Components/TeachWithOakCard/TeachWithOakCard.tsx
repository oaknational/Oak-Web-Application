import { OakCard } from "@oaknational/oak-components";
import { useFeatureFlagVariantKey } from "posthog-js/react";

export function MaybeTeachWithOakCard() {
  const shouldShowCard =
    useFeatureFlagVariantKey("teachers-teach-with-oak") === "teacher-tip";

  if (!shouldShowCard) return null;

  return (
    <OakCard
      aspectRatio="1/1"
      heading="Ever wondered why our lessons are structured this way?"
      subCopy="See how explanation, checks for understanding, practice and feedback work together to support pupils' learning."
      href="heyyy"
      linkIconName="arrow-right"
      linkText="See the thinking behind Oak lessons"
      imageSrc="/images/teach-with-oak.png"
      cardOrientation={["column", "row", "row"]}
    />
  );
}
