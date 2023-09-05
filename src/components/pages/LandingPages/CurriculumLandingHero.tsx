import React, { FC } from "react";

import { Heading, P } from "@/components/Typography";
import Flex from "@/components/Flex/Flex";
import Box from "@/components/Box/Box";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import Illustration from "@/components/Illustration/Illustration";
import { getSizes } from "@/components/CMSImage/getSizes";
import Cover from "@/components/Cover/Cover";

type CurriculumLandingHeroProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
};

const CurriculumLandingHero: FC<CurriculumLandingHeroProps> = (props) => {
  const { subjectPhaseOptions } = props;
  return (
    <Flex $position={"relative"} $flexDirection={"row"} $width={"100%"}>
      <Flex $flexDirection={"column"} $width={"100%"}>
        <Box $maxWidth={["100%", "50%"]} $mb={[48, 80]} $position={"relative"}>
          <Heading tag="h1" $font={["heading-4", "heading-3"]} $mb={[16, 24]}>
            Oak's curricula
          </Heading>
          <P $font={["body-2", "body-1"]}>
            Our curricula covers all the national curriculum subjects across
            primary and secondary. Use our fully-sequenced units of lessons as
            high-quality models that represent great design from across the
            sector.
          </P>
        </Box>
        <Box $maxWidth={["100%", 960]}>
          <SubjectPhasePicker {...subjectPhaseOptions} />
        </Box>
      </Flex>
      <Cover
        $top={[48, 48, 0]}
        $right={[0, 12, 0]}
        $display={["none", "block"]}
      >
        <Flex $justifyContent={"flex-end"}>
          <Illustration
            noCrop
            $width={"40%"}
            $maxHeight={[480, 400, 480]}
            $maxWidth={[480, 400, 480]}
            $position={"absolute"}
            sizes={getSizes([400, 600])}
            slug="planning-curriculum"
          />
        </Flex>
      </Cover>
    </Flex>
  );
};

export default CurriculumLandingHero;
