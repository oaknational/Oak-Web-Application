import { FC } from "react";
import { OakBox, OakHeading, OakP } from "@oaknational/oak-components";

const NoResourcesToShare: FC = () => (
  <OakBox $ph="inner-padding-xl" $mb="space-between-xl" $mt="space-between-xl">
    <OakHeading
      $mb="space-between-s"
      $mt="space-between-m"
      $font={["heading-6", "heading-7"]}
      tag={"h2"}
    >
      No resources to share
    </OakHeading>
    <OakP $mb="space-between-m" $font={["body-2", "body-1"]}>
      Sorry, there are no teaching resources available to share for this lesson.
    </OakP>
  </OakBox>
);

export default NoResourcesToShare;
