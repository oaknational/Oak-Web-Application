import { ChangeEvent, FC, useState } from "react";

import blogListItems from "../../browser-lib/fixtures/blogListItems";
import keyStagesNavData from "../../browser-lib/fixtures/keyStagesNav";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import BlogList from "../../components/BlogList";
import ButtonAsLink from "../../components/Button/ButtonAsLink";
import Card from "../../components/Card";
import CardTitle from "../../components/Card/CardComponents/CardTitle";
import Flex from "../../components/Flex";
import NewsletterForm, {
  useNewsletterForm,
} from "../../components/Forms/NewsletterForm";
import Grid from "../../components/Grid";
import GridArea from "../../components/Grid/GridArea";
import Input from "../../components/Input";
import KeyStagesNav from "../../components/KeyStagesNav/KeyStagesNav";
import Layout from "../../components/Layout";
import { Heading, P } from "../../components/Typography";

const TeacherHome: FC = () => {
  const { onSubmit } = useNewsletterForm();
  const [value, setValue] = useState("");
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} background={"grey1"}>
      <Grid cg={16} rg={[16, 48, 80]}>
        <GridArea colSpan={[12, 12, 8]}>
          <Heading
            fontSize={48}
            tag={"h1"}
            mt={64}
            mb={16}
            data-testid="home-page-title"
          >
            Big inspiring heading
          </Heading>
          <Heading fontSize={20} tag={"h2"} data-testid="home-page-title">
            Subheading giving further interesting info and details about other
            cool things
          </Heading>
        </GridArea>
        <GridArea colSpan={[12, 12, 4]}>
          <Card>
            <Heading tag={"h3"} fontSize={20}>
              Training new teachers
            </Heading>
            <P>16/08</P>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 12, 12]}>
          <Input
            icon="Search"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            placeholder="Search for subjects, lessons, quizes, lessons plans and much much more..."
            value={value}
            id={""}
          ></Input>
          <Flex mt={32} justifyContent={"center"}>
            <KeyStagesNav keyStages={keyStagesNavData}></KeyStagesNav>
          </Flex>
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
    </Layout>
  );
};

export default TeacherHome;
