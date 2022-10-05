import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";
import { Fragment } from "react";

import config from "../../config";
import CMSClient, {
  AboutWorkWithUsPage,
  Card as CardType,
} from "../../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import SummaryCard from "../../components/Card/SummaryCard";
import ButtonLinkNav from "../../components/ButtonLinkNav/ButtonLinkNav";
import Card from "../../components/Card";
import AboutContactCard from "../../components/AboutContactCard";
import { reducedAboutNavLinks } from "../../browser-lib/fixtures/aboutNav";
import { Heading } from "../../components/Typography";
import Typography from "../../components/Typography/Typography";
import ButtonAsLink from "../../components/Button/ButtonAsLink";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";

export type AboutPageProps = {
  pageData: AboutWorkWithUsPage;
};

const getWorkWithUsCards = (aboutPage: AboutWorkWithUsPage) => {
  const workWithUsCards: CardType[] = [
    {
      title: aboutPage.cards.advisory.title,
      image: aboutPage.cards.advisory.image,
      bodyPortableText: aboutPage.cards.advisory.bodyPortableText,
      cta: aboutPage.cards.advisory.cta,
    },
    {
      title: aboutPage.cards.curriculumPartner.title,
      image: aboutPage.cards.curriculumPartner.image,
      bodyPortableText: aboutPage.cards.curriculumPartner.bodyPortableText,
      cta: aboutPage.cards.curriculumPartner.cta,
    },
    {
      title: aboutPage.cards.joinTheTeam.title,
      image: aboutPage.cards.joinTheTeam.image,
      bodyPortableText: aboutPage.cards.joinTheTeam.bodyPortableText,
      cta: aboutPage.cards.joinTheTeam.cta,
    },
    {
      title: aboutPage.cards.teacherResearch.title,
      image: aboutPage.cards.teacherResearch.image,
      bodyPortableText: aboutPage.cards.teacherResearch.bodyPortableText,
      cta: aboutPage.cards.teacherResearch.cta,
    },
  ];

  return workWithUsCards;
};

const AboutUsBoard: NextPage<AboutPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} $background={"white"}>
      <MaxWidth $pt={[64, 80]}>
        <SummaryCard
          title={"about us"}
          heading={pageData.heading}
          summary={
            "We’re here to support great teaching. We’re an independent public body. We work in partnership to improve pupil outcomes and close the disadvantage gap by supporting teachers to teach, and enabling pupils to access a high-quality curriculum."
          }
          background={"teachersPastelYellow"}
        >
          <ButtonLinkNav
            $mt={36}
            buttons={reducedAboutNavLinks}
            selected={"work with us"}
            ariaLabel={"work with us"}
          />
        </SummaryCard>
        <AboutIntroCard
          image={{
            imageSrc: "/images/illustrations/work-with-us-500.png",
            alt: "work with us illustration",
          }}
          bodyPortableText={pageData.introPortableText}
        />
        <Grid $mb={[72, 92]} $cg={28} $rg={[0, 40]}>
          {getWorkWithUsCards(pageData).map((card) => (
            <Fragment key={card.title}>
              <GridArea $colSpan={[12, 6]}>
                <Card $background={"videoBlue"}>
                  <Heading
                    $font={["heading-6", "heading-5"]}
                    tag={"h3"}
                    $mb={24}
                  >
                    {card.title}
                  </Heading>
                  <Typography $mb={32} $font={["body-2", "body-1"]}>
                    <PortableText value={card.bodyPortableText} />
                  </Typography>
                  {card.cta?.linkType == "external" && (
                    <Flex>
                      <ButtonAsLink
                        background="teachersHighlight"
                        label={card.cta.label}
                        href={card.cta.external}
                        icon={"External"}
                      >
                        {card.cta.label}
                      </ButtonAsLink>
                    </Flex>
                  )}
                </Card>
              </GridArea>
            </Fragment>
          ))}
        </Grid>

        <AboutContactCard />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const aboutWorkWithUsPage = await CMSClient.aboutWorkWithUsPage({
    previewMode: isPreviewMode,
  });

  if (!aboutWorkWithUsPage) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: aboutWorkWithUsPage,
    },
    revalidate: config.get("sanityRevalidateSeconds"),
  };
};

export default AboutUsBoard;
