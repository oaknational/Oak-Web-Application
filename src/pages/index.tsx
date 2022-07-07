import { FC } from "react";

import LandingPageLayout from "../components/Layout/LandingPageLayout";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading, P } from "../components/Typography";
import BlogList from "../components/BlogList/BlogList";
import Flex from "../components/Flex";
import CardTitle from "../components/Card/CardComponents/CardTitle";
import ButtonAsLink from "../components/Button/ButtonAsLink";
import Icon from "../components/Icon";
import NewsletterForm, {
  useNewsletterForm,
} from "../components/Forms/NewsletterForm";
import blogListItems from "../browser-lib/fixtures/blogListItems";
import CardLink from "../components/Card/CardLink";

const Home: FC = () => {
  const { onSubmit } = useNewsletterForm();

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

      <Grid cg={16} rg={[16]} mt={[16, 48, 80]}>
        <GridArea colSpan={[12, 6, 4]} order={[0, 0, 0]}>
          <Card background="white">
            <CardTitle
              icon="Home"
              iconPosition="leading"
              iconSize={32}
              tag="h2"
            >
              About Oak Academy
            </CardTitle>
            <P fontSize={16} mb={24}>
              Preview, plan and customise each element of our lessons to meet
              your needs -
            </P>
            <ButtonAsLink
              mt={"auto"}
              fullWidth
              href="/"
              label="Find out more"
            />
          </Card>
        </GridArea>

        <GridArea colSpan={[12, 12, 8]} rowSpan={3} order={[3, 1, 0]}>
          <Flex background={"white"} pa={24}>
            <BlogList
              title={"Stay up to date!"}
              items={blogListItems}
              titleTag={"h2"}
            />
          </Flex>
        </GridArea>

        <GridArea colSpan={[12, 6, 4]} order={[2, 0, 0]}>
          <Card background="white">
            <CardTitle
              icon="Home"
              iconPosition="leading"
              iconSize={32}
              tag="h2"
            >
              Need some help?
            </CardTitle>
            <P fontSize={16} mb={24}>
              Preview, plan and customise each element of our lessons to meet
              your needs - whether inside and outside the classroom.
            </P>
            <ButtonAsLink
              mt={"auto"}
              fullWidth
              href="https://support.thenational.academy/"
              label="Visit Help Center"
            />
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 4]} order={[2, 0, 0]}>
          <NewsletterForm onSubmit={onSubmit} />
        </GridArea>
      </Grid>
    </LandingPageLayout>
  );
};

export default Home;
