import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
  OakIcon,
  OakMaxWidth,
} from "@oaknational/oak-components";

import ImageContainer from "@/components/GenericPagesComponents/ImageContainer";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

const PupilTab: FC = () => {
  return (
    <OakFlex $background={"mint"} $pv="inner-padding-xl" $overflow={"hidden"}>
      <OakMaxWidth $ph={["inner-padding-m"]} $pb={"inner-padding-xl"}>
        <OakGrid $cg={"all-spacing-4"}>
          <OakGridArea $colSpan={[12, 6]}>
            <OakFlex
              $flexDirection={"column"}
              $maxWidth={"all-spacing-22"}
              $pt={"inner-padding-xl2"}
              $alignItems={"flex-start"}
              $gap={"space-between-m"}
              $flexGrow={0}
              $flexShrink={1}
              $flexBasis={"auto"}
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
            </OakFlex>
          </OakGridArea>
          <OakGridArea $colSpan={[12, 6]} $alignItems={"flex-end"}>
            <ImageContainer imageSlug={"pupils-with-worksheet"}>
              {/* @todo check left position with marketing */}
              <OakIcon
                iconName="burst"
                $position={"absolute"}
                $top={"all-spacing-0"}
                $left={"all-spacing-0"}
                $width={"100%"}
                $height={"100%"}
                $display={["none", "none", "block"]}
                $transform={"scale(1.5)"}
              />
            </ImageContainer>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default PupilTab;
