import { OakBox, OakCard, parseColor } from "@oaknational/oak-components";
import styled from "styled-components";

const CardWrapper = styled(OakBox)`
  p {
    color: ${parseColor("text-subdued")};
  }
`;

export const TeachWithOakPromoSection = () => {
  return (
    <CardWrapper
      $display={"flex"}
      $maxWidth={["100%", "13rem"]}
      $mt={"spacing-24"}
      $mb={["spacing-24", "spacing-56"]}
    >
      <OakCard
        heading="Ever wondered why our lessons are structured this way?"
        headingLevel="h3"
        href="/teachers/teach-with-oak"
        subCopy="See how explanation, checks for understanding, practice and feedback work together to support pupils' learning."
        linkText="See the thinking"
        $background={"bg-decorative2-subdued"}
        $borderRadius={"border-radius-l"}
        hoverBackground={"bg-decorative2-subdued"}
      />
    </CardWrapper>
  );
};
