import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";
import { Fragment } from "react";

import CMSClient, { AboutPage, Card as CardType } from "../../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import SummaryCard from "../../components/Card/SummaryCard";
import ButtonLinkNav from "../../components/ButtonLinkNav/ButtonLinkNav";
import Card from "../../components/Card";
import AboutContactCard from "../../components/AboutContactCard";
import aboutNavLinks from "../../browser-lib/fixtures/aboutNav";
import { Heading } from "../../components/Typography";
import Typography from "../../components/Typography/Typography";
import ButtonAsLink from "../../components/Button/ButtonAsLink";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";

export type AboutPageProps = {
  pageData: AboutPage;
  isPreviewMode: boolean;
};

const getWorkWithUsCards = (aboutPage: AboutPage) => {
  const workWithUsCards: CardType[] = [
    {
      title: aboutPage.workWithUs.cards.advisory.title,
      image: aboutPage.workWithUs.cards.advisory.image,
      bodyPortableText: aboutPage.workWithUs.cards.advisory.bodyPortableText,
      cta: aboutPage.workWithUs.cards.advisory.cta,
    },
    {
      title: aboutPage.workWithUs.cards.curriculumPartner.title,
      image: aboutPage.workWithUs.cards.curriculumPartner.image,
      bodyPortableText:
        aboutPage.workWithUs.cards.curriculumPartner.bodyPortableText,
      cta: aboutPage.workWithUs.cards.curriculumPartner.cta,
    },
    {
      title: aboutPage.workWithUs.cards.joinTheTeam.title,
      image: aboutPage.workWithUs.cards.joinTheTeam.image,
      bodyPortableText: aboutPage.workWithUs.cards.joinTheTeam.bodyPortableText,
      cta: aboutPage.workWithUs.cards.joinTheTeam.cta,
    },
    {
      title: aboutPage.workWithUs.cards.teacherResearch.title,
      image: aboutPage.workWithUs.cards.teacherResearch.image,
      bodyPortableText:
        aboutPage.workWithUs.cards.teacherResearch.bodyPortableText,
      cta: aboutPage.workWithUs.cards.teacherResearch.cta,
    },
  ];

  return workWithUsCards;
};

const AboutUsBoard: NextPage<AboutPageProps> = ({
  pageData,
  isPreviewMode,
}) => {
  console.log(pageData);
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background={"white"}
      isPreviewMode={isPreviewMode}
    >
      <MaxWidth $pt={[64, 80]}>
        <SummaryCard
          title={"about us"}
          heading={pageData.workWithUs.sectionHeading}
          summary={pageData.workWithUs.introPortableText}
          background={"teachersPastelYellow"}
        >
          <ButtonLinkNav
            $mt={36}
            buttons={aboutNavLinks}
            selected={"work with us"}
          />
        </SummaryCard>
        <AboutIntroCard
          image={{
            imageSrc: "/images/illustrations/work-with-us.svg",
            alt: "work with us illustration",
          }}
          bodyPortableText={pageData.workWithUs.introPortableText}
        />
        <Grid $mb={[72, 92]} $cg={28} $rg={[0, 40]}>
          {getWorkWithUsCards(pageData).map((card) => (
            <Fragment key={card.title}>
              <GridArea $colSpan={[12, 6]}>
                <Card $background={"videoBlue"}>
                  <Heading
                    $lineHeight={["22px", "34px"]}
                    $fontSize={[20, 24]}
                    tag={"h3"}
                    $mb={24}
                  >
                    {card.title}
                  </Heading>
                  <Typography $mb={32} $fontSize={[16, 18]}>
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

  const aboutPage = await CMSClient.aboutPage({
    previewMode: isPreviewMode,
  });

  return {
    props: {
      pageData: aboutPage,
      isPreviewMode,
    },
    revalidate: 10,
  };
};

export default AboutUsBoard;
