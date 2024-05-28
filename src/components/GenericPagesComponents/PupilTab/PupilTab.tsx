import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
} from "@oaknational/oak-components";

import ImageContainer from "@/components/GenericPagesComponents/ImageContainer";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Svg from "@/components/SharedComponents/Svg";

const PupilTab: FC = () => {
  return (
    <OakFlex $background={"lemon"} $pv="inner-padding-xl" $overflow={"hidden"}>
      <MaxWidth $ph={[16]} $pb={24}>
        <OakGrid $cg={"all-spacing-4"}>
          <OakGridArea $colSpan={[12, 6]}>
            <Flex
              $flexDirection={"column"}
              $maxWidth={[640]}
              $pt={32}
              $alignItems={"flex-start"}
              $gap={24}
              $flex={"0 1 auto"}
            >
              <OakHeading $font={"heading-7"} tag={"h1"} $color={"grey70"}>
                Pupils
              </OakHeading>
              <OakHeading $font={"heading-3"} tag={"h2"}>
                Learn and revise
              </OakHeading>

              <OakTypography $font={"body-1"}>
                We provide free online lessons with videos, quizzes, and more.
                Whatever the subject, from primary to GCSE, we've got you
                covered.
              </OakTypography>

              <ButtonAsLink
                label={"Find a lesson"}
                aria-label="Find a lesson"
                variant={"brushNav"}
                page={"pupil-year-index"}
                icon={"arrow-right"}
                $iconPosition={"trailing"}
                iconBackground="black"
                $mb={24}
              />
            </Flex>
          </OakGridArea>
          <OakGridArea $colSpan={[12, 6]} $alignItems={"flex-end"}>
            <ImageContainer imageSlug={"pupils-with-worksheet"}>
              <Svg
                $position={"absolute"}
                $top={0}
                $left={-20}
                $display={["none", "none", "block"]}
                name="burst"
                $transform={"scale(1.5)"}
              />
            </ImageContainer>
          </OakGridArea>
        </OakGrid>
      </MaxWidth>
    </OakFlex>
  );
};

export default PupilTab;
