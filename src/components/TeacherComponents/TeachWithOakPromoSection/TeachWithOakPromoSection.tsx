import { OakBox, OakCard } from "@oaknational/oak-components";

export const TeachWithOakPromoSection = () => {
  return (
    <OakBox
      $display={"flex"}
      $maxWidth={["100%", "spacing-240"]}
      $mt={"spacing-24"}
      $mb={["spacing-24", "spacing-56"]}
    >
      <OakCard
        heading="Ever wondered why our lessons are structured this way?"
        headingLevel="h2"
        href="/teachers/teach-with-oak"
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
