import React, { FC } from "react";

import { Heading, P } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import Illustration from "@/components/SharedComponents/Illustration/Illustration";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import Cover from "@/components/SharedComponents/Cover/Cover";

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
            Oak's curricula cover all the national curriculum subjects across
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
