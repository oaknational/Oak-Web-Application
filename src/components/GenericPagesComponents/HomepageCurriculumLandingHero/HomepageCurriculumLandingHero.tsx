import React, { FC } from "react";
import { OakHeading, OakP, OakFlex, OakBox } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
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
        <Box $maxWidth={["100%", "50%"]} $mb={[48, 80]} $position={"relative"}>
          <OakHeading
            tag="h1"
            $font={["heading-4", "heading-3"]}
            $mb={["space-between-s", "space-between-m"]}
          >
            Oak's curricula
          </OakHeading>
          <OakP $font={["body-2", "body-1"]}>
            Oak's curricula cover all the national curriculum subjects across
            primary and secondary. Use our fully-sequenced units of lessons as
            high-quality models that represent great design from across the
            sector.
          </OakP>
        </Box>
        <Box $maxWidth={["100%", 960]}>
          <SubjectPhasePicker {...subjectPhaseOptions} />
        </Box>
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
          />
        </OakFlex>
      </Cover>
    </OakBox>
  );
};

export default HomepageCurriculumLandingHero;
