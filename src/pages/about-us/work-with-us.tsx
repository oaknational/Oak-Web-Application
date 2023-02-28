import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";
import { Fragment } from "react";

import CMSClient from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";
import { AboutWorkWithUsPage } from "../../common-lib/cms-types";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Card from "../../components/Card";
import AboutContactCard from "../../components/AboutContactCard";
import { Heading } from "../../components/Typography";
import Typography from "../../components/Typography/Typography";
import ButtonAsLink from "../../components/Button/ButtonAsLink";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";
import BrushBorders from "../../components/SpriteSheet/BrushSvgs/BrushBorders";
import AboutUsSummaryCard from "../../components/pages/AboutUs/AboutUsSummaryCard";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";

export type AboutPageProps = {
  pageData: AboutWorkWithUsPage;
};

const getWorkWithUsCards = (aboutPage: AboutWorkWithUsPage) => {
  const { advisory, curriculumPartner, joinTheTeam, teacherResearch } =
    aboutPage.cards;
  return [advisory, curriculumPartner, joinTheTeam, teacherResearch];
};

const AboutUsBoard: NextPage<AboutPageProps> = ({ pageData }) => {
  const { seo } = pageData;
  return (
    <Layout seoProps={getSeoProps(seo)} $background={"white"}>
      <MaxWidth $pt={[64, 80]}>
        <AboutUsSummaryCard {...pageData} />
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
                <Card $ph={[16, 24]} $pv={[32, 24]} $background={"videoBlue"}>
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
                        page={null}
                        href={card.cta.external}
                        icon={"external"}
                        $iconPosition={"trailing"}
                      >
                        {card.cta.label}
                      </ButtonAsLink>
                    </Flex>
                  )}
                  <BrushBorders hideOnMobileH color={"videoBlue"} />
                </Card>
              </GridArea>
            </Fragment>
          ))}
        </Grid>

        <AboutContactCard {...pageData.contactSection} />
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

  const results = {
    props: {
      pageData: aboutWorkWithUsPage,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default AboutUsBoard;
