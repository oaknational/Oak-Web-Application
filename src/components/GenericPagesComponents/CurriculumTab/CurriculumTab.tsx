import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLI,
  OakUL,
  OakTypography,
} from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import CurriculumTabBadge from "@/components/GenericPagesComponents/CurriculumTabBadge";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex";
import Illustration from "@/components/SharedComponents/Illustration";
import MaxWidth from "@/components/SharedComponents/MaxWidth";

const CurriculumTab: FC = () => {
  return (
    <Flex $background={"aqua"} $pv={24}>
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
                Teachers & subject leads
              </OakHeading>
              <OakHeading $font={"heading-3"} tag={"h2"}>
                New curriculum plans
              </OakHeading>
              <Flex $flexDirection={"column"}>
                {" "}
                <OakTypography $font={"body-1"}>
                  Explore our new curriculum plans.
                </OakTypography>
                <OakUL $mt="space-between-s" $font={"body-1"}>
                  <OakLI>National curriculum-aligned</OakLI>
                  <OakLI>Primary and secondary sequences</OakLI>
                  <OakLI>Designed by curriculum experts</OakLI>
                </OakUL>
              </Flex>

              <Flex $gap={24} $flexWrap={"wrap"} $pb={24}>
                <ButtonAsLink
                  label={"View curriculum plans"}
                  variant={"brushNav"}
                  page={"curriculum-landing-page"}
                  icon={"arrow-right"}
                  $iconPosition={"trailing"}
                  iconBackground="black"
                />
              </Flex>
            </Flex>
          </OakGridArea>
          <OakGridArea $colSpan={[12, 6]} $alignItems={"flex-end"}>
            <Flex
              $pv={64}
              $flexDirection={"column"}
              $justifyContent={"space-between"}
              $alignItems={"flex-end"}
              $flex={"0 1 auto"}
              $position={"relative"}
              $minWidth={[0, 350]}
              $display={["none", "flex"]}
              $maxWidth={524}
              $pl={20}
            >
              <Flex $flexDirection={"column"} $gap={10}>
                <Illustration
                  slug={"teacher-whiteboard"}
                  noCrop
                  $objectFit="contain"
                  priority
                  $ba={3}
                  $borderStyle={"solid"}
                  $borderColor={"black"}
                />
                <OakTypography $font={"body-1"} $color={"black"}>
                  50% of teachers feel more confident in curriculum design.
                </OakTypography>
              </Flex>

              <Box
                $position={"absolute"}
                $bottom={120}
                $left={-20}
                aria-hidden={true}
              >
                {" "}
                <CurriculumTabBadge icon="bell" />
              </Box>
            </Flex>
          </OakGridArea>
        </OakGrid>
      </MaxWidth>
    </Flex>
  );
};

export default CurriculumTab;
