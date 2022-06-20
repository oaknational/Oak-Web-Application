import { FC } from "react";

import { useUser } from "../context/Auth";
import Layout from "../components/Layout";
import Bookmarks from "../components/Bookmarks";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading } from "../components/Typography";
import CardAsLink from "../components/Card/CardAsLink";
import CardImageIconButton from "../components/Card/CardVariants/CardImageIconButton";
import Flex from "../components/Flex";
import Icon from "../components/Icon";

const Home: FC = () => {
  const user = useUser();
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} background={"grey1"}>
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
              Use Oak in Beta
            </Heading>
          </Card>
        </GridArea>

        <GridArea colSpan={[12, 12, 6]}>
          <CardAsLink
            background={"white"}
            href="https://classroom.thenational.academy/"
          >
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems="center"
            >
              <Icon name={"GraduationCap"} size={64} />
              <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
                Classroom
              </Heading>
            </Flex>
          </CardAsLink>
        </GridArea>
        <GridArea colSpan={[12, 12, 6]}>
          <CardAsLink
            background={"white"}
            href="https://teachers.thenational.academy/"
          >
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems="center"
            >
              <Icon name={"University"} size={64} />
              <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
                Teacher Hub
              </Heading>
            </Flex>
          </CardAsLink>
        </GridArea>

        <GridArea colSpan={[12, 4, 4]}>
          <CardAsLink background={"white"} href="/">
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems="center"
            >
              <Icon name={"ChevronRight"} size={100} />
              <Heading mt={0} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
                Curriculum
              </Heading>
            </Flex>
          </CardAsLink>
        </GridArea>
        <GridArea colSpan={[12, 4, 4]}>
          <Card background={"white"}>Lesson Planning</Card>
        </GridArea>
        <GridArea colSpan={[12, 4, 4]}>
          <Card background={"white"}>Oak for School</Card>
        </GridArea>

        <GridArea colSpan={[12, 12, 4]}>
          <CardImageIconButton
            label={"Classroom"}
            text={""}
            title={"Classroom"}
            href={"/"}
            icon={"OpenExternal"}
            iconPosition={"leading"}
            textCenter={true}
            tag={"h2"}
          />
        </GridArea>
        <GridArea colSpan={[12, 12, 8]}>
          <Card background={"white"}>Curriculum</Card>
        </GridArea>
      </Grid>

      {user && <Bookmarks />}
    </Layout>
  );
};

export default Home;
