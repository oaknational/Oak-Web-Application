import { FC } from "react";
import styled from "styled-components";

import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading, P, Span } from "../components/Typography";
import CardLink from "../components/Card/CardLink";
import AboutContactBlogList from "../components/AboutContactBlogList/AboutContactBlogList";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import CardImage from "../components/Card/CardComponents/CardImage";
import CardLinkIcon from "../components/Card/CardLinkIcon";
import Box from "../components/Box";
import Layout from "../components/Layout";
import BoxBorders from "../components/SpriteSheet/BrushSvgs/BoxBorders";
import Flex from "../components/Flex";
import Icon from "../components/Icon";

const TransformYGridArea = styled(GridArea)`
  transform: translateY(50%);
`;

const Notification: FC = () => {
  return (
    <Card
      $background="white"
      $flexGrow={0}
      $transform={[undefined, "rotate(2deg)"]}
      $pa={16}
      $pr={48}
      $dropShadow="notificationCard"
    >
      <BoxBorders />
      <Box
        $position="absolute"
        $top={0}
        $left={0}
        $transform="translate(-40%,-40%)"
      >
        <Icon
          name="Bell"
          $background="pupilsHighlight"
          variant="brush"
          size={30}
        />
      </Box>
      <Span $fontSize={14} $color="oakGrey4">
        Blog
      </Span>
      <Heading $fontSize={20} tag="h2" $mt={4}>
        <CardLink href="/">About the future of Oak</CardLink>
      </Heading>
      <P $mt={4}>Find out more</P>
    </Card>
  );
};

const Home: FC = () => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <Flex $flexDirection={"column"} $position="relative">
        <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
          <MaxWidth $ph={12}>
            <Flex
              $width={"100%"}
              $pt={[40, 32]}
              $pb={[32, 40]}
              $flexDirection={["column", "row"]}
            >
              <Flex
                $mr="auto"
                $pb={[32, 0]}
                $flexDirection={"column"}
                $justifyContent="flex-end"
              >
                <Heading
                  $fontSize={[32]}
                  tag={"h1"}
                  $mb={[20, 16]}
                  data-testid="home-page-title"
                  $color={"black"}
                >
                  Oak is evolving
                </Heading>
                <Heading tag={"h2"} $fontSize={[20]}>
                  We’re growing our support to help you thrive.
                </Heading>
              </Flex>
              <Box $ph={[16, 0]}>
                <Notification />
              </Box>
            </Flex>
            <Grid $cg={[8, 16]}>
              <GridArea $colSpan={[6, 6, 6]}>
                <Card
                  $background={"white"}
                  $flexDirection={["column-reverse", "row"]}
                  $justifyContent={"space-between"}
                  $alignItems="center"
                  $pa={0}
                  $borderRadius={4}
                >
                  <Box
                    $overflow="hidden"
                    $pv={[0, 16]}
                    $width={"100%"}
                    $height={"100%"}
                  >
                    <Flex
                      $width={"100%"}
                      $flexGrow={1}
                      $justifyContent={"center"}
                      $alignItems={"center"}
                      $transform={["translateY(10%)", undefined]}
                    >
                      <CardImage
                        alt={"classroom illustration"}
                        imageSrc={"/images/illustrations/classroom.svg"}
                        position={"left center"}
                      />
                    </Flex>
                  </Box>
                  <Heading
                    $mr={[0, 72]}
                    $fontSize={[20, 32]}
                    tag={"h3"}
                    $color={"black"}
                    $mt={[12, 0]}
                  >
                    <CardLink href="https://classroom.thenational.academy/">
                      Classroom
                    </CardLink>
                  </Heading>
                </Card>
              </GridArea>
              <GridArea $colSpan={[6, 6, 6]}>
                <Card
                  $background={"white"}
                  $flexDirection={["column-reverse", "row"]}
                  $justifyContent={["center", "space-between"]}
                  $alignItems="center"
                  $pa={0}
                  $borderRadius={4}
                >
                  <Box
                    $width={["100%", "100%", "50%"]}
                    $height="100%"
                    $overflow="hidden"
                  >
                    <CardImage
                      alt="teacher hub illustration"
                      imageSrc={"/images/illustrations/teacher.svg"}
                    />
                  </Box>
                  <Heading
                    $mr={[0, 56]}
                    $fontSize={[20, 32]}
                    tag={"h3"}
                    $color={"black"}
                    $mt={[12, 0]}
                  >
                    <CardLink href="https://teachers.thenational.academy/">
                      Teachers Hub
                    </CardLink>
                  </Heading>
                </Card>
              </GridArea>
              <TransformYGridArea $colSpan={[12, 6]}>
                <CardLinkIcon
                  title={"Plan a lesson"}
                  titleTag={"h4"}
                  background="pupilsLimeGreen"
                  href={"/lesson-planning"}
                />
              </TransformYGridArea>
              <TransformYGridArea $colSpan={[12, 6]}>
                <CardLinkIcon
                  title={"Develop your curriculum"}
                  titleTag={"h4"}
                  background={"teachersYellow"}
                  href={"/develop-your-curriculum"}
                />
              </TransformYGridArea>
            </Grid>
          </MaxWidth>
        </Flex>
      </Flex>
      <Flex $background={"teachersPastelYellow"} $justifyContent={"center"}>
        <MaxWidth $ph={[0, 12]} $mt={[80, 32]} $mb={64}>
          <AboutContactBlogList />
        </MaxWidth>
      </Flex>
    </Layout>
  );
};

export default Home;
