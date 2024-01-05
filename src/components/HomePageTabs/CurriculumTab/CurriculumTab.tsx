import { FC } from "react";

import Box from "@/components/SharedComponents/Box";
import Badge from "@/components/Badge/";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex";
import { GridArea } from "@/components/Grid";
import Grid from "@/components/Grid/Grid";
import Illustration from "@/components/Illustration/Illustration";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { Heading, LI, UL } from "@/components/Typography";
import Typography from "@/components/Typography/Typography";

const CurriculumTab: FC = () => {
  return (
    <Flex $background={"aqua"} $pv={24}>
      <MaxWidth $ph={[16]} $pb={24}>
        <Grid $cg={16}>
          <GridArea $colSpan={[12, 6]}>
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
                  Explore our new curriculum plans and early-release units.
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
                <ButtonAsLink
                  label={"Early-release units"}
                  variant={"brushNav"}
                  page={"early-release-units-page"}
                  icon={"arrow-right"}
                  $iconPosition={"trailing"}
                  iconBackground="black"
                />
              </Flex>
            </Flex>
          </GridArea>
          <GridArea $colSpan={[12, 6]} $alignItems={"flex-end"}>
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
                <Badge icon="bell" />
              </Box>
            </Flex>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default CurriculumTab;
