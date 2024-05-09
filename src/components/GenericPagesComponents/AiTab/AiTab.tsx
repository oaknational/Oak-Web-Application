import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
} from "@oaknational/oak-components";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Illustration from "@/components/SharedComponents/Illustration";

const AiTab: FC = () => {
  return (
    <OakFlex $background={"pink"} $pv="inner-padding-xl" $overflow={"hidden"}>
      <MaxWidth $ph={[16]} $pb={24}>
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
                AI tools created for educators
              </OakHeading>
              <OakTypography $font={"body-1"}>
                Plan lessons and create quizzes with Oak AI Experiments, a new
                and freely available suite of practical AI tools designed to
                help save teachers time.
              </OakTypography>
              <ButtonAsLink
                label={"Go to Oak AI Experiments"}
                aria-label="Try our ai tools (this will open in a new tab)"
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
            <Illustration
              slug="ai-hero"
              priority
              $borderStyle={"none"}
              $maxWidth={450}
              noCrop
              $objectFit="contain"
            />
          </OakGridArea>
        </OakGrid>
      </MaxWidth>
    </OakFlex>
  );
};

export default AiTab;
