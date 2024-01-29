import { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import CurriculumTabBadge from "@/components/GenericPagesComponents/CurriculumTabBadge";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex";
import Illustration from "@/components/SharedComponents/Illustration";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Typography, {
  Heading,
  LI,
  UL,
} from "@/components/SharedComponents/Typography";

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
              <Heading $font={"heading-7"} tag={"h1"} $color={"grey70"}>
                Teachers & subject leads
              </Heading>
              <Heading $font={"heading-3"} tag={"h2"}>
                New curriculum plans
              </Heading>
              <Flex $flexDirection={"column"}>
                {" "}
                <Typography $font={"body-1"}>
                  Explore our new curriculum plans.
                </Typography>
                <UL $mt={16} $font={"body-1"}>
                  <LI>National curriculum-aligned</LI>
                  <LI>Primary and secondary sequences</LI>
                  <LI>Designed by curriculum experts</LI>
                </UL>
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
                <Typography $font={"body-1"} $color={"black"}>
                  50% of teachers feel more confident in curriculum design.
                </Typography>
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
