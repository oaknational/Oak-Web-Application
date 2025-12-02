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
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";

const PupilTab: FC = () => {
  return (
    <OakFlex
      data-testid="pupil-tab"
      $background={"bg-decorative1-main"}
      $pv="spacing-24"
      $overflow={"hidden"}
    >
      <OakMaxWidth $ph={["spacing-16"]} $pb={"spacing-24"}>
        <OakGrid $cg={"spacing-16"}>
          <OakGridArea $colSpan={[12, 6]}>
            <OakFlex
              $flexDirection={"column"}
              $maxWidth={"spacing-640"}
              $pt={"spacing-32"}
              $alignItems={"flex-start"}
              $gap={"spacing-24"}
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
            <ImageContainer
              imageSlug={"pupils-with-worksheet"}
              width={518}
              height={313}
              sizes={getSizes([100, 518])}
            >
              {/* @todo check left position with marketing */}
              <OakIcon
                iconName="burst"
                $position={"absolute"}
                $top={"spacing-0"}
                $left={"spacing-0"}
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
