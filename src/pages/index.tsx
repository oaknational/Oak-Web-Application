import { FC, useEffect } from "react";

import LandingPageLayout from "../components/Layout/LandingPageLayout";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading, P } from "../components/Typography";
import Icon from "../components/Icon";
import useAnalytics from "../context/Analytics/useAnalytics";
import CardLink from "../components/Card/CardLink";
import AboutContactBlogList from "../components/AboutContactBlogList/AboutContactBlogList";
import DismissibleCard from "../components/Card/DismissibleCard";
import Flex from "../components/Flex";

const Home: FC = () => {
  const { track } = useAnalytics();

  useEffect(() => {
    track("test-event", {
      testProperty:
        "some value (currently should send once when the page loads)",
    });
  }, [track]);

  return (
    <LandingPageLayout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <Grid $cg={16} $rg={[16, 48, 80]}>
        <GridArea $colSpan={[12, 12, 8]}>
          <Heading
            $fontSize={48}
            tag={"h1"}
            $mt={80}
            data-testid="home-page-title"
          >
            Supporting Schools To Build Their Curriculum
          </Heading>
          <P $mt={16}>
            Free tools, research and 40,000 editable lesson resources to support
            schools to develop a high-quality curriculum
          </P>
        </GridArea>

        <GridArea $colSpan={[12, 12, 4]}>
          <DismissibleCard title="Beta">
            <Heading $fontSize={20} tag={"h2"}>
              <Flex $alignItems={"center"} $mb={12}>
                <Icon
                  size={24}
                  name={"GraduationCap"}
                  $mr={8}
                  $color={"grey8"}
                />
                <P $color={"grey8"} $fontSize={16} $fontWeight={400}>
                  Next Webinar
                </P>
              </Flex>
              <CardLink href={"/beta/onboarding"}>Use Oak in Beta</CardLink>
              <P $color={"grey8"} $fontSize={16} $fontWeight={400} $mt={8}>
                16/03/2022 &bull; 3:30pm
              </P>
            </Heading>
          </DismissibleCard>
        </GridArea>

        <GridArea $colSpan={[12, 12, 6]}>
          <Card
            $background={"white"}
            $flexDirection={"column"}
            $justifyContent={"center"}
            $alignItems="center"
          >
            <Icon name={"GraduationCap"} size={64} />
            <Heading
              $mt={24}
              $mb={0}
              $fontSize={24}
              tag={"h5"}
              $color={"grey8"}
            >
              <CardLink href="https://classroom.thenational.academy/">
                Classroom
              </CardLink>
            </Heading>
          </Card>
        </GridArea>
        <GridArea $colSpan={[12, 12, 6]}>
          <Card
            $background={"white"}
            $flexDirection={"column"}
            $justifyContent={"center"}
            $alignItems="center"
          >
            <Icon name={"University"} size={64} />
            <Heading
              $mt={24}
              $mb={0}
              $fontSize={24}
              tag={"h5"}
              $color={"grey8"}
            >
              <CardLink href="https://teachers.thenational.academy/">
                Teacher Hub
              </CardLink>
            </Heading>
          </Card>
        </GridArea>

        <GridArea $colSpan={[12, 4, 4]}>
          <Card
            $flexDirection={"column"}
            $justifyContent={"center"}
            $alignItems="center"
            $background={"white"}
          >
            <Icon name={"University"} size={64} />
            <Heading
              $mt={24}
              $mb={0}
              $fontSize={24}
              tag={"h5"}
              $color={"grey8"}
            >
              <CardLink href="/">Curriculum</CardLink>
            </Heading>
          </Card>
        </GridArea>
        <GridArea $colSpan={[12, 4, 4]}>
          <Card
            $flexDirection={"column"}
            $justifyContent={"center"}
            $alignItems={"center"}
            $background={"white"}
          >
            <Icon name={"University"} size={64} />
            <Heading
              $mt={24}
              $mb={0}
              $fontSize={24}
              tag={"h5"}
              $color={"grey8"}
            >
              <CardLink href="/">Lesson Planning</CardLink>
            </Heading>
          </Card>
        </GridArea>
        <GridArea $colSpan={[12, 4, 4]}>
          <Card
            $flexDirection={"column"}
            $justifyContent={"center"}
            $alignItems="center"
            $background={"white"}
          >
            <Icon name={"GraduationCap"} size={64} />
            <Heading
              $mt={24}
              $mb={0}
              $fontSize={24}
              tag={"h5"}
              $color={"grey8"}
            >
              <CardLink href="/">Oak for Schools</CardLink>
            </Heading>
          </Card>
        </GridArea>
      </Grid>
      <AboutContactBlogList />
    </LandingPageLayout>
  );
};

export default Home;
