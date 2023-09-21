import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import { PortableText } from "@portabletext/react";
import { useFeatureFlagEnabled } from "posthog-js/react";

import CMSClient from "../../node-lib/cms";
import { AboutBoardPage } from "../../common-lib/cms-types";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Card from "../../components/Card";
import AboutContactCard from "../../components/AboutContactCard";
import Typography, { Heading, Hr, P } from "../../components/Typography";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import BoxBorders from "../../components/SpriteSheet/BrushSvgs/BoxBorders";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";
import IconButtonAsLink from "../../components/Button/IconButtonAsLink";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import BioCardList from "../../components/BioCardList";
import AboutUsSummaryCard from "../../components/pages/AboutUs/AboutUsSummaryCard";
import getPageProps from "../../node-lib/getPageProps";

export type AboutPageProps = {
  pageData: AboutBoardPage;
};

const AboutUsBoard: NextPage<AboutPageProps> = ({ pageData }) => {
  const {
    seo,
    introPortableText,
    boardMembers,
    documents,
    governancePortableText,
  } = pageData;

  const bioModalsEnabled = useFeatureFlagEnabled("about-us--board--bio-modals");
  return (
    <Layout seoProps={getSeoProps(seo)} $background={"white"}>
      <MaxWidth $pt={[64, 80]}>
        <AboutUsSummaryCard {...pageData} />
        <AboutIntroCard
          image={{
            illustration: "supporting",
            sizes: "(min-width: 750px) 720px, 100vw",
            priority: true,
          }}
          bodyPortableText={introPortableText}
        />
        {boardMembers && (
          <>
            <Heading
              $mb={[40, 32]}
              $font={["heading-6", "heading-5"]}
              tag={"h2"}
              $textAlign={["center"]}
            >
              Our interim board
            </Heading>
            <BioCardList
              $mb={[80, 92]}
              $ph={[16, 0]}
              bios={boardMembers}
              withModals={bioModalsEnabled}
            />
          </>
        )}
        <Heading $font={"heading-5"} tag={"h2"} $textAlign={["center", "left"]}>
          Documents
        </Heading>
        <Flex $mh={[16, 0]} $flexDirection={"column"}>
          <Typography $width={"100%"}>
            <Hr $color={"pastelTurquoise"} $mv={32} />
          </Typography>

          <Grid $rg={[16]} $cg={[12, 20]}>
            {documents.map((doc) => {
              const fileSizeInMB = (doc.file.asset.size / 1012 / 1012).toFixed(
                1,
              );
              return (
                <GridArea key={doc.title} $colSpan={[6, 3, 2]}>
                  <Card $height={220} $pa={16}>
                    <BoxBorders gapPosition="rightTop" />
                    <Flex
                      $justifyContent={"space-between"}
                      $height={"100%"}
                      $flexDirection={"column"}
                    >
                      <Heading $font={"heading-7"} tag={"h3"}>
                        {doc.title}
                      </Heading>
                      <Flex
                        $alignItems={"center"}
                        $justifyContent={"space-between"}
                      >
                        <P>{`${fileSizeInMB}MB ${doc.file.asset.extension.toUpperCase()}`}</P>
                        <IconButtonAsLink
                          icon={"download"}
                          aria-label={`Download ${doc.title} as ${fileSizeInMB} megabyte ${doc.file.asset.extension}`}
                          page={null}
                          href={`${doc.file.asset.url}?dl`}
                          background={"teachersHighlight"}
                        />
                      </Flex>
                    </Flex>
                  </Card>
                </GridArea>
              );
            })}
          </Grid>
          <Typography $width={"100%"}>
            <Hr $color={"pastelTurquoise"} $mv={0} $mt={32} />
          </Typography>
        </Flex>
        <Card
          $mh="auto"
          $mv={[80, 92]}
          $ph={[16, 80]}
          $pv={0}
          $width={["100%", "70%"]}
        >
          <Heading $mb={20} $font={"heading-5"} tag={"h2"}>
            Governance
          </Heading>

          <Typography $font={["body-1", "body-2"]}>
            <PortableText value={governancePortableText} />
          </Typography>
        </Card>

        <AboutContactCard {...pageData.contactSection} />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "board::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const aboutBoardPage = await CMSClient.aboutBoardPage({
        previewMode: isPreviewMode,
      });

      if (!aboutBoardPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<AboutPageProps> = {
        props: {
          pageData: aboutBoardPage,
        },
      };

      return results;
    },
  });
};

export default AboutUsBoard;
