import { FC, useEffect } from "react";
import styled from "styled-components";

import LandingPageLayout from "../components/Layout/LandingPageLayout";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading } from "../components/Typography";
import useAnalytics from "../context/Analytics/useAnalytics";
import CardLink from "../components/Card/CardLink";
import AboutContactBlogList from "../components/AboutContactBlogList/AboutContactBlogList";
import Flex from "../components/Flex";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import CardImage from "../components/Card/CardComponents/CardImage";
import { getBreakpoint } from "../styles/utils/responsive";
import CardLinkIcon from "../components/Card/CardLinkIcon";

const OverflowHidden = styled(Flex)`
  @media (max-width: ${getBreakpoint("medium")}px) {
    overflow: hidden;
  }
`;

const TransformYGridArea = styled(GridArea)`
  transform: translateY(50%);
`;

const TransformTeacherImageWrap = styled(Flex)`
  transform: scale(120%);

  @media (max-width: ${getBreakpoint("small")}px) {
    transform: translateY(10%);
  }
`;

const TransformClassroomImageWrap = styled(Flex)`
  @media (max-width: ${getBreakpoint("small")}px) {
    transform: translateY(10%);
  }
`;

const Home: FC = () => {
  const { track } = useAnalytics();

  useEffect(() => {
    track("test-event", {
      testProperty:
        "some value (currently should send once when the page loads)",
    });
  }, [track]);

  return (
    <LandingPageLayout seoProps={DEFAULT_SEO_PROPS}>
      <Flex $flexDirection={"column"} $position="relative">
        <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
          <MaxWidth>
            <Grid $cg={[8, 16]}>
              <GridArea $colSpan={[12, 12, 8]}>
                <Heading
                  $fontSize={[32, 48]}
                  tag={"h1"}
                  $mt={[64, 80]}
                  $mb={[20, 24]}
                  data-testid="home-page-title"
                  $color={"black"}
                >
                  Oak Is Changing...
                </Heading>
                <Heading
                  tag={"h2"}
                  $fontSize={[16, 24]}
                  $mb={[32, 64]}
                >
                  Over 40,000 curriculum-aligned resources for everyday use,
                  completely free.
                </Heading>
              </GridArea>

              <GridArea $colSpan={[6, 6, 6]}>
                <Card
                  $background={"white"}
                  $flexDirection={["column-reverse", "row"]}
                  $justifyContent={"space-between"}
                  $alignItems="center"
                  $pa={0}
                  $borderRadius={4}
                >
                  <OverflowHidden $pv={[0, 16]} $width={"100%"}>
                    <TransformClassroomImageWrap
                      $width={"100%"}
                      $flexGrow={1}
                      $justifyContent={"center"}
                      $alignItems={"center"}
                    >
                      <CardImage
                        alt={"classroom illustration"}
                        imageSrc={"/images/illustrations/classroom.svg"}
                        position={"left center"}
                      ></CardImage>
                    </TransformClassroomImageWrap>
                  </OverflowHidden>

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
                  <OverflowHidden $width={["100%", "100%", "50%"]}>
                    <TransformTeacherImageWrap
                      $justifyContent={"center"}
                      $alignItems={"center"}
                      $flexGrow={1}
                    >
                      <CardImage
                        alt="teacher hub illustration"
                        imageSrc={"/images/illustrations/teacher.svg"}
                      ></CardImage>
                    </TransformTeacherImageWrap>
                  </OverflowHidden>

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
              <TransformYGridArea $colSpan={[12, 4, 4]}>
                <CardLinkIcon
                  title={"Plan a lesson"}
                  titleTag={"h4"}
                  background="pupilsLimeGreen"
                  href={"/planning"}
                ></CardLinkIcon>
              </TransformYGridArea>
              <TransformYGridArea $colSpan={[12, 4, 4]}>
                <CardLinkIcon
                  title={"Develop Your Curriculum"}
                  titleTag={"h4"}
                  background={"teachersYellow"}
                  href={"/curriculum"}
                ></CardLinkIcon>
              </TransformYGridArea>
              <TransformYGridArea $colSpan={[12, 4, 4]}>
                <CardLinkIcon
                  title={"Support Your Team"}
                  titleTag={"h4"}
                  background={"pupilsPink"}
                  href={"/support"}
                ></CardLinkIcon>
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
    </LandingPageLayout>
  );
};

export default Home;
