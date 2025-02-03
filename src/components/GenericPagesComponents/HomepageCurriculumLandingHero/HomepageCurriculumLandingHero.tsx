import React, { FC } from "react";
import {
  OakHeading,
  OakP,
  OakFlex,
  OakBox,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";

import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import Illustration from "@/components/SharedComponents/Illustration/Illustration";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import Cover from "@/components/SharedComponents/Cover/Cover";

type HomepageCurriculumLandingHeroProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
};

const HomepageCurriculumLandingHero: FC<HomepageCurriculumLandingHeroProps> = (
  props,
) => {
  const { subjectPhaseOptions } = props;
  return (
    <OakBox $position={"relative"} $width={"100%"}>
      <OakFlex $flexDirection={"column"} $width={"100%"}>
        <OakGrid>
          <OakGridArea $colSpan={[12, 6]}>
            <OakBox
              $mb={["space-between-l", "space-between-xxxl"]}
              $position={"relative"}
            >
              <OakHeading
                tag="h1"
                $font={["heading-4", "heading-3"]}
                $mb={["space-between-s", "space-between-m"]}
              >
                Oak's curricula
              </OakHeading>
              <OakP $font={["body-2", "body-1"]}>
                Oak's curricula cover all the national curriculum subjects
                across primary and secondary. Use our fully-sequenced units of
                lessons as high-quality models that represent great design from
                across the sector.
              </OakP>
            </OakBox>
          </OakGridArea>
        </OakGrid>
        <OakBox $maxWidth={["100%", "all-spacing-23"]}>
          <SubjectPhasePicker {...subjectPhaseOptions} />
        </OakBox>
      </OakFlex>
      <Cover
        $top={[48, 48, 0]}
        $right={[0, 12, 0]}
        $display={["none", "block"]}
      >
        <OakFlex $justifyContent={"flex-end"}>
          <Illustration
            noCrop
            $width={"40%"}
            $maxHeight={[480, 400, 480]}
            $maxWidth={[480, 400, 480]}
            $position={"absolute"}
            sizes={getSizes([400, 600])}
            slug="planning-curriculum"
            loading="eager"
            format={null}
          />
        </OakFlex>
      </Cover>
    </OakBox>
  );
};

export default HomepageCurriculumLandingHero;
