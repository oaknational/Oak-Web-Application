import { FC } from "react";

import blogListItems from "../../browser-lib/fixtures/blogListItems";
import BlogList from "../BlogList";
import ButtonAsLink from "../Button/ButtonAsLink";
import Card from "../Card";
import CardTitle from "../Card/CardComponents/CardTitle";
import Flex from "../Flex";
import NewsletterForm, { useNewsletterForm } from "../Forms/NewsletterForm";
import Grid, { GridArea } from "../Grid";
import { P } from "../Typography";

const AboutContactBlogList: FC = () => {
  const { onSubmit } = useNewsletterForm();
  return (
    <Grid cg={16} rg={[16]} mt={[16, 48, 80]}>
      <GridArea colSpan={[12, 6, 4]} order={[0, 0, 0]}>
        <Card background="white">
          <CardTitle icon="Home" iconPosition="leading" iconSize={32} tag="h2">
            About Oak Academy
          </CardTitle>
          <P fontSize={16} mb={24}>
            Preview, plan and customise each element of our lessons to meet your
            needs -
          </P>
          <ButtonAsLink mt={"auto"} fullWidth href="/" label="Find out more" />
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
          <CardTitle icon="Home" iconPosition="leading" iconSize={32} tag="h2">
            Need some help?
          </CardTitle>
          <P fontSize={16} mb={24}>
            Preview, plan and customise each element of our lessons to meet your
            needs - whether inside and outside the classroom.
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
  );
};

export default AboutContactBlogList;
