import { FC } from "react";

import LandingPageLayout from "../components/Layout/LandingPageLayout";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading } from "../components/Typography";
import Icon from "../components/Icon";
import CardLink from "../components/Card/CardLink";
import AboutContactBlogList from "../components/AboutContactBlogList/AboutContactBlogList";

const Home: FC = () => {
  return (
    <LandingPageLayout seoProps={DEFAULT_SEO_PROPS} background={"grey1"}>
      <Grid cg={16} rg={[16, 48, 80]}>
        <GridArea colSpan={[12, 12, 8]}>
          <Heading
            fontSize={48}
            tag={"h1"}
            mt={64}
            data-testid="home-page-title"
          >
            Oak National Academy
          </Heading>
        </GridArea>
        <GridArea colSpan={[12, 12, 4]}>
          <Card background={"white"} mt={48}>
            <Heading fontSize={20} tag={"h2"}>
              <CardLink href={"/beta/onboarding"}>Use Oak in Beta</CardLink>
            </Heading>
          </Card>
        </GridArea>

        <GridArea colSpan={[12, 12, 6]}>
          <Card
            background={"white"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
          >
            <Icon name={"GraduationCap"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              <CardLink href="https://classroom.thenational.academy/">
                Classroom
              </CardLink>
            </Heading>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 12, 6]}>
          <Card
            background={"white"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
          >
            <Icon name={"University"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              <CardLink href="https://teachers.thenational.academy/">
                Teacher Hub
              </CardLink>
            </Heading>
          </Card>
        </GridArea>

        <GridArea colSpan={[12, 4, 4]}>
          <Card
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
            background={"white"}
          >
            <Icon name={"University"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              <CardLink href="/">Curriculum</CardLink>
            </Heading>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 4, 4]}>
          <Card
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            background={"white"}
          >
            <Icon name={"University"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              <CardLink href="/">Lesson Planning</CardLink>
            </Heading>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 4, 4]}>
          <Card
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
            background={"white"}
          >
            <Icon name={"GraduationCap"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              <CardLink href="/">Oak for Schools</CardLink>
            </Heading>
          </Card>
        </GridArea>
      </Grid>
      <AboutContactBlogList></AboutContactBlogList>
    </LandingPageLayout>
  );
};

export default Home;
