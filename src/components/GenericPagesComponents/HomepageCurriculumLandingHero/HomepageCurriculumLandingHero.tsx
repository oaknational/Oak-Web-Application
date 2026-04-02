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
    <OakBox $position={"relative"} $width={"100%"}>
      <OakHeading
        tag="h2"
        id="curriculum-picker"
        $font={["heading-5", "heading-4"]}
        $mb={["spacing-16", "spacing-24"]}
        $background={"bg-decorative1-main"}
        $textAlign={"left"}
      >
        See Oak's curriculum principles in practice
      </OakHeading>
      <OakFlex $flexDirection={"column"} $width={"100%"}>
        <OakBox $maxWidth={["100%", "spacing-960"]}>
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
