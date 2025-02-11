import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
  OakMaxWidth,
} from "@oaknational/oak-components";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import ImageContainer from "@/components/GenericPagesComponents/ImageContainer";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";

const AiTab: FC = () => {
  return (
    <OakFlex $background={"mint"} $pv="inner-padding-xl" $overflow={"hidden"}>
      <OakMaxWidth $ph={["inner-padding-m"]} $pb={"inner-padding-xl"}>
        <OakGrid $cg={"all-spacing-4"}>
          <OakGridArea $colSpan={[12, 6]}>
            <OakFlex
              $flexDirection={"column"}
              $maxWidth="all-spacing-22"
              $pt="inner-padding-xl"
              $alignItems="flex-start"
              $gap={"space-between-m"}
            >
              <OakHeading $font={"heading-7"} tag={"h1"} $color={"grey70"}>
                Teachers
              </OakHeading>
              <OakHeading $font={"heading-3"} tag={"h2"}>
                Your lesson prep, transformed with AI
              </OakHeading>
              <OakTypography $font={"body-1"}>
                Try our free, AI-powered lesson assistant: Aila. Whether it’s
                creating bespoke resources or helping you tailor content to your
                class, Aila can help speed things along.
              </OakTypography>
              <ButtonAsLink
                label={"Create a lesson with Aila"}
                aria-label="Create a lesson with Aila (this will open in a new tab)"
                variant={"brushNav"}
                page={"labs"}
                icon={"external"}
                $iconPosition={"trailing"}
                iconBackground="black"
                $mb={24}
              />
            </OakFlex>
          </OakGridArea>
          <OakGridArea
            $colSpan={[12, 6]}
            $alignItems={"flex-end"}
            $display={["none", "flex"]}
            $justifyContent="center"
            $pv="inner-padding-xl"
          >
            <ImageContainer
              imageSlug={"hero-aila"}
              width={518}
              height={313}
              sizes={getSizes([100, 518])}
            />
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default AiTab;
