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
import CardAsLink from "../components/Card/CardAsLink";
import Icon from "../components/Icon";
import NewsletterForm, {
  useNewsletterForm,
} from "../components/Forms/NewsletterForm";
import blogListItems from "../browser-lib/fixtures/blogListItems";

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
              Use Oak in Beta
            </Heading>
          </Card>
        </GridArea>

        <GridArea colSpan={[12, 12, 6]}>
          <CardAsLink
            background={"white"}
            href="https://classroom.thenational.academy/"
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
            ariaLabel="Classroom"
          >
            <Icon name={"GraduationCap"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              Classroom
            </Heading>
          </CardAsLink>
        </GridArea>
        <GridArea colSpan={[12, 12, 6]}>
          <CardAsLink
            background={"white"}
            href="https://teachers.thenational.academy/"
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
            ariaLabel="Teacher Hub"
          >
            <Icon name={"University"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              Teacher Hub
            </Heading>
          </CardAsLink>
        </GridArea>

        <GridArea colSpan={[12, 4, 4]}>
          <CardAsLink
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
            background={"white"}
            href="/"
            ariaLabel="Curriculum"
          >
            <Icon name={"University"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              Curriculum
            </Heading>
          </CardAsLink>
        </GridArea>
        <GridArea colSpan={[12, 4, 4]}>
          <CardAsLink
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            background={"white"}
            href="/"
            ariaLabel="Lesson Planning"
          >
            <Icon name={"University"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              Lesson Planning
            </Heading>
          </CardAsLink>
        </GridArea>
        <GridArea colSpan={[12, 4, 4]}>
          <CardAsLink
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
            background={"white"}
            href="/"
            ariaLabel="Oak for schools"
          >
            <Icon name={"GraduationCap"} size={64} />
            <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
              Oak for Schools
            </Heading>
          </CardAsLink>
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
              title="About Oak Academy"
            />
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
              title="Need some help?"
            />
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
