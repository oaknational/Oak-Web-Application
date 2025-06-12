import React, { FC } from "react";
import { OakHeading, OakFlex, OakBox } from "@oaknational/oak-components";

import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import Cover from "@/components/SharedComponents/Cover/Cover";

type HomepageCurriculumLandingHeroProps = {
  curriculumPhaseOptions: SubjectPhasePickerData;
};

const HomepageCurriculumLandingHero: FC<HomepageCurriculumLandingHeroProps> = (
  props,
) => {
  const { curriculumPhaseOptions } = props;
  return (
    <OakBox as="nav" $position={"relative"} $width={"100%"}>
      <OakHeading
        tag="h2"
        id="curriculum-picker"
        $font={["heading-5", "heading-4"]}
        $mb={["space-between-s", "space-between-m"]}
        $background={"mint"}
        $textAlign={"left"}
      >
        See Oak's curriculum principles in practice
      </OakHeading>
      <OakFlex $flexDirection={"column"} $width={"100%"}>
        <OakBox $maxWidth={["100%", "all-spacing-23"]}>
          <SubjectPhasePicker {...curriculumPhaseOptions} />
        </OakBox>
      </OakFlex>
      <Cover
        $top={[48, 48, 0]}
        $right={[0, 12, 0]}
        $display={["none", "block"]}
      />
    </OakBox>
  );
};

export default HomepageCurriculumLandingHero;
