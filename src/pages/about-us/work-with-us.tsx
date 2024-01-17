import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import { Fragment } from "react";

import CMSClient from "@/node-lib/cms";
import { AboutWorkWithUsPage } from "@/common-lib/cms-types";
import Layout from "@/components/AppComponents/Layout";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Card from "@/components/SharedComponents/Card";
import GenericContactCard from "@/components/GenericPagesComponents/GenericContactCard";
import Typography, { Heading } from "@/components/SharedComponents/Typography";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import GenericIntroCard from "@/components/GenericPagesComponents/GenericIntroCard";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import GenericSummaryCard from "@/components/GenericPagesComponents/GenericSummaryCard";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getPageProps from "@/node-lib/getPageProps";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

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
      <MaxWidth $mb={[56, 80]} $pt={[64, 80]}>
        <GenericSummaryCard {...pageData} />
        <GenericIntroCard
          image={{
            illustration: "supporting",
            sizes: "(min-width: 750px) 720px, 100vw",
            priority: true,
          }}
          bodyPortableText={pageData.introPortableText}
        />
        <Grid $mb={[72, 92]} $cg={28} $rg={[0, 40]}>
          {getWorkWithUsCards(pageData).map((card) => (
            <Fragment key={card.title}>
              <GridArea $colSpan={[12, 6]}>
                <Card $ph={[16, 24]} $pv={[32, 24]} $background={"aqua"}>
                  <Heading
                    $font={["heading-6", "heading-5"]}
                    tag={"h2"}
                    $mb={24}
                  >
                    {card.title}
                  </Heading>
                  <Typography $mb={32} $font={["body-2", "body-1"]}>
                    <PortableTextWithDefaults value={card.bodyPortableText} />
                  </Typography>
                  {card.cta?.linkType == "external" && (
                    <Flex>
                      <ButtonAsLink
                        background="blue"
                        label={card.cta.label}
                        page={null}
                        href={card.cta.external}
                        icon={"external"}
                        $iconPosition={"trailing"}
                        iconBackground="lemon"
                      >
                        {card.cta.label}
                      </ButtonAsLink>
                    </Flex>
                  )}
                  <BrushBorders hideOnMobileH color={"aqua"} />
                </Card>
              </GridArea>
            </Fragment>
          ))}
        </Grid>

        <GenericContactCard {...pageData.contactSection} />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "work-with-us::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const aboutWorkWithUsPage = await CMSClient.aboutWorkWithUsPage({
        previewMode: isPreviewMode,
      });

      if (!aboutWorkWithUsPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<AboutPageProps> = {
        props: {
          pageData: aboutWorkWithUsPage,
        },
      };

      return results;
    },
  });
};

export default AboutUsBoard;
