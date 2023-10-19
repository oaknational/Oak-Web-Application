import { NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/AppLayout/AppLayout";
import EarlyReleaseUnitsHeader from "@/components/EarlyReleaseUnitsHeader";
import EarlyReleaseExemplarUnits from "@/components/EarlyReleaseExemplarUnits";
import earlyReleaseExemplarUnitsFixture from "@/node-lib/curriculum-api/fixtures/earlyReleaseExemplarUnits.fixture";
import { Heading, Hr, P } from "@/components/Typography";
import Box from "@/components/Box";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import Grid, { GridArea } from "@/components/Grid";
import Card from "@/components/Card";
import Flex from "@/components/Flex";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import AnchorTarget from "@/components/AnchorTarget";

const EarlyReleaseUnits: NextPage = () => {
  const exemplarUnitsFixture = earlyReleaseExemplarUnitsFixture();
  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS}>
      <EarlyReleaseUnitsHeader />
      <MaxWidth>
        <Flex $mb={[24, 92]} $flexDirection={"column"}>
          <Heading
            $mt={[24, 48]}
            $mb={[20, 36]}
            $mh={[16, 0]}
            $font={["heading-4", "heading-3"]}
            tag={"h2"}
          >
            Designed for your classroom
          </Heading>
          <Grid $rg={32} $cg={32}>
            <GridArea $mh={[16, 0]} $colSpan={[12, 4]}>
              <Card $background={"teachersPastelYellow"}>
                <BrushBorders color={"teachersPastelYellow"} />
                <Heading $mb={32} $font={["heading-6", "heading-5"]} tag={"h3"}>
                  Fully sequenced
                </Heading>
                <P $font={"body-1"}>
                  Careful sequencing makes it easy for you to build a clear plan
                  of learning for the term ahead.
                </P>
              </Card>
            </GridArea>
            <GridArea $mh={[16, 0]} $colSpan={[12, 4]}>
              <Card $background={"teachersPastelYellow"}>
                <BrushBorders color={"teachersPastelYellow"} />
                <Heading $mb={32} $font={["heading-6", "heading-5"]} tag={"h3"}>
                  Free to access
                </Heading>
                <P $font={"body-1"}>
                  All our teaching resources are free to access and there for
                  you, whenever you need them.
                </P>
              </Card>
            </GridArea>
            <GridArea $mh={[16, 0]} $colSpan={[12, 4]}>
              <Card $background={"teachersPastelYellow"}>
                <BrushBorders color={"teachersPastelYellow"} />
                <Heading $mb={32} $font={["heading-6", "heading-5"]} tag={"h3"}>
                  Adaptable
                </Heading>
                <P $font={"body-1"}>
                  Our slide decks and worksheets are editable, so you can adapt
                  them for your pupils and context.
                </P>
              </Card>
            </GridArea>
          </Grid>
        </Flex>
      </MaxWidth>
      <Box $position={"relative"}>
        <AnchorTarget id={"primary"} />
        <EarlyReleaseExemplarUnits {...exemplarUnitsFixture.primary} />
      </Box>
      <Box $background={"lavender"}>
        <Hr thickness={4} $mt={0} $mb={0} />
      </Box>
      <Box $position={"relative"}>
        <AnchorTarget id={"secondary"} />
        <EarlyReleaseExemplarUnits {...exemplarUnitsFixture.secondary} />
      </Box>
    </AppLayout>
  );
};

export default EarlyReleaseUnits;
