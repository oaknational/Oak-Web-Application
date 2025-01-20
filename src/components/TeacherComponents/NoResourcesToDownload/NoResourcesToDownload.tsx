import { FC } from "react";
import { OakBox, OakHeading, OakP } from "@oaknational/oak-components";

const NoResourcesToDownload: FC = () => (
  <OakBox $ph="inner-padding-xl" $mb="space-between-xl" $mt="space-between-xl">
    <OakHeading
      $mb="space-between-s"
      $mt="space-between-m"
      $font={["heading-6", "heading-7"]}
      tag={"h2"}
    >
      No downloads available
    </OakHeading>
    <OakP $mb="space-between-m" $font={["body-2", "body-1"]}>
      Sorry, there are no downloadable teaching resources available for this
      lesson.
    </OakP>
  </OakBox>
);

export default NoResourcesToDownload;
