import { FC } from "react";
import { OakBox, OakHeading, OakP } from "@oaknational/oak-components";

const NoResourcesToShare: FC = () => (
  <OakBox $ph="spacing-24" $mb="spacing-56" $mt="spacing-56">
    <OakHeading
      $mb="spacing-16"
      $mt="spacing-24"
      $font={["heading-6", "heading-7"]}
      tag={"h2"}
    >
      No resources to share
    </OakHeading>
    <OakP $mb="spacing-24" $font={["body-2", "body-1"]}>
      Sorry, there are no teaching resources available to share for this lesson.
    </OakP>
  </OakBox>
);

export default NoResourcesToShare;
