import { FC, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";

import LandingPageLayout from "../components/Layout/LandingPageLayout";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading } from "../components/Typography";
import Icon from "../components/Icon";
import useAnalytics from "../context/Analytics/useAnalytics";
import CardLink from "../components/Card/CardLink";
import AboutContactBlogList from "../components/AboutContactBlogList/AboutContactBlogList";
import Flex from "../components/Flex";
import getColorByName from "../styles/themeHelpers/getColorByName";

const Home: FC = () => {
  const { track } = useAnalytics();

  useEffect(() => {
    track("test-event", {
      testProperty:
        "some value (currently should send once when the page loads)",
    });
  }, [track]);

  const TopBackgroundSection = styled.div`
    ::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 100%;
      width: 100vw;
      z-index: -1;
      background: ${getColorByName("pupilsGreen")};
    }
  `;

  const BottomBackgroundSection = styled.div`
    ::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 110%;
      width: 100vw;
      z-index: -1;
      background: ${getColorByName("teachersPastelYellow")};
    }
  `;

  return (
    <LandingPageLayout seoProps={DEFAULT_SEO_PROPS}>
      <Flex flexDirection={"column"} position="relative">
        <TopBackgroundSection>
          <Grid cg={16} rg={[16, 48, 80]}>
            <GridArea colSpan={[12, 12, 8]}>
              <Heading
                fontSize={48}
                tag={"h1"}
                lineHeight={56}
                mt={80}
                data-testid="home-page-title"
                color={"black"}
              >
                Oak Is Changing...
              </Heading>
              <Heading tag={"h2"} lineHeight={32} fontSize={24} mt={16}>
                Over 40,000 curriculum-aligned resources for everyday use,
                completely free.
              </Heading>
            </GridArea>

            <GridArea colSpan={[12, 12, 6]}>
              <Card
                background={"white"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems="center"
                pa={0}
              >
                <Flex pv={16}>
                  <Image
                    width={300}
                    height={200}
                    src={"/images/illustrations/classroom.svg"}
                  ></Image>
                </Flex>

                <Heading mr={72} fontSize={32} tag={"h5"} color={"black"}>
                  <CardLink href="https://classroom.thenational.academy/">
                    Classroom
                  </CardLink>
                </Heading>
              </Card>
            </GridArea>
            <GridArea colSpan={[12, 12, 6]}>
              <Card
                background={"white"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems="center"
                pa={0}
              >
                <Flex ml={56}>
                  <Image
                    width={180}
                    height={200}
                    src={"/images/illustrations/teacher.svg"}
                  ></Image>
                </Flex>
                <Heading mr={72} fontSize={32} tag={"h3"} color={"black"}>
                  <CardLink href="https://teachers.thenational.academy/">
                    Teachers Hub
                  </CardLink>
                </Heading>
              </Card>
            </GridArea>
            <GridArea colSpan={[12, 4, 4]}>
              <Card
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems="center"
                background={"white"}
                ph={16}
                pv={40}
              >
                <Heading fontSize={24} tag={"h4"} color={"black"}>
                  <CardLink href="/planning">Plan a lesson</CardLink>
                </Heading>

                <Icon name={"ArrowRight"} size={32} />
              </Card>
            </GridArea>
            <GridArea colSpan={[12, 4, 4]}>
              <Card
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems="center"
                background={"teachersYellow"}
                ph={16}
                pv={40}
              >
                <Heading fontSize={24} tag={"h4"} color={"black"}>
                  <CardLink href="/">Develop Your Curriculum</CardLink>
                </Heading>

                <Icon name={"ArrowRight"} size={32} />
              </Card>
            </GridArea>
            <GridArea colSpan={[12, 4, 4]}>
              <Card
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems="center"
                background={"pupilsPink"}
                ph={16}
                pv={40}
              >
                <Heading fontSize={24} tag={"h4"} color={"black"}>
                  <CardLink href="/planning">Support Your Team</CardLink>
                </Heading>

                <Icon name={"ArrowRight"} size={32} />
              </Card>
            </GridArea>
          </Grid>
        </TopBackgroundSection>
      </Flex>
      <Flex position="relative">
        <BottomBackgroundSection>
          <AboutContactBlogList />
        </BottomBackgroundSection>
      </Flex>
    </LandingPageLayout>
  );
};

export default Home;
