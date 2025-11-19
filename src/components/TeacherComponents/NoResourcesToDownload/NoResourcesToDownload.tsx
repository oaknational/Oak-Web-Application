import { FC } from "react";
import { OakBox, OakHeading, OakP } from "@oaknational/oak-components";

const NoResourcesToDownload: FC = () => (
  <OakBox $ph="spacing-24" $mb="spacing-56" $mt="spacing-56">
    <OakHeading
      $mb="spacing-16"
      $mt="spacing-24"
      $font={["heading-6", "heading-7"]}
      tag={"h2"}
    >
      No downloads available
    </OakHeading>
    <OakP $mb="spacing-24" $font={["body-2", "body-1"]}>
      Sorry, there are no downloadable teaching resources available for this
      lesson.
    </OakP>
  </OakBox>
);

export default NoResourcesToDownload;
