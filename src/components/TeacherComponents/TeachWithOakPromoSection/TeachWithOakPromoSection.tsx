import { OakBox, OakCard } from "@oaknational/oak-components";

import { resolveOakHref, TeachWithOakQueryProps } from "@/common-lib/urls";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export const TeachWithOakPromoSection = (
  query: Readonly<TeachWithOakQueryProps>,
) => {
  const { teachWithOakAccessed } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );

  const href = resolveOakHref({
    page: "teach-with-oak",
    query,
  });

  return (
    <OakBox
      $display={"flex"}
      $maxWidth={["100%", "spacing-240"]}
      $mt={"spacing-24"}
      $mb={["spacing-24", "spacing-56"]}
      onClick={() => teachWithOakAccessed({ componentType: "promo_card" })}
    >
      <OakCard
        heading="Ever wondered why our lessons are structured this way?"
        headingLevel="h2"
        href={href}
        subCopy="See how explanation, checks for understanding, practice and feedback work together to support pupils' learning."
        subCopyColor="text-subdued"
        linkText="See the thinking"
        $background={"bg-decorative2-subdued"}
        $borderRadius={"border-radius-l"}
        hoverBackground={"bg-decorative2-subdued"}
      />
    </OakBox>
  );
};
