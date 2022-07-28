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
    <Grid $cg={[16, 32]} $rg={[0, 32]} $mt={[16, 64, 80]}>
      <GridArea $colSpan={[12, 6, 4]} $order={[0, 0, 0]}>
        <Card $borderRadius={0} $background="white">
          <CardTitle
            icon="Search"
            iconPosition="leading"
            iconSize={32}
            tag="h2"
          >
            About Us
          </CardTitle>
          <P color={"black"} fontSize={16} $mb={24}>
            Discover who we are, what we do and how we work
          </P>
          <ButtonAsLink $mt={"auto"} fullWidth href="/" label="Find out more" />
        </Card>
      </GridArea>

      <GridArea
        $mb={[64, 0]}
        $colSpan={[12, 12, 8]}
        $rowSpan={3}
        $order={[3, 1, 0]}
      >
        <Flex $background={"white"} $pa={24}>
          <BlogList
            title={"Stay up to date!"}
            items={blogListItems}
            titleTag={"h2"}
          />
        </Flex>
      </GridArea>

      <GridArea $mb={[64, 0]} $colSpan={[12, 6, 4]} $order={[2, 0, 0]}>
        <Card $background="white">
          <CardTitle
            icon="Search"
            iconPosition="leading"
            iconSize={32}
            tag="h2"
          >
            Need some help?
          </CardTitle>
          <P $fontSize={16} $mb={24}>
            Find everything you need to get started and make the most of Oak
            National Academy.
          </P>
          <ButtonAsLink
            $mt={"auto"}
            fullWidth
            href="https://support.thenational.academy/"
            label="Visit Help Center"
          />
        </Card>
      </GridArea>
      <GridArea $colSpan={[12, 12, 4]} $order={[4, 2, 0]}>
        <NewsletterForm onSubmit={onSubmit} />
      </GridArea>
    </Grid>
  );
};

export default AboutContactBlogList;
x;
