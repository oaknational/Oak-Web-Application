import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";
import { Fragment } from "react";

import CMSClient, { AboutPage } from "../../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import SummaryCard from "../../components/Card/SummaryCard";
import ButtonLinkNav from "../../components/ButtonLinkNav/ButtonLinkNav";
import Card from "../../components/Card";
import AboutContactCard from "../../components/AboutContactCard";
import Typography, { Heading, Hr, P } from "../../components/Typography";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import BoxBorders from "../../components/SpriteSheet/BrushSvgs/BoxBorders";
import aboutNavLinks from "../../browser-lib/fixtures/aboutNav";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";
import IconButtonAsLink from "../../components/Button/IconButtonAsLink";

export type AboutPageProps = {
  pageData: AboutPage;
  isPreviewMode: boolean;
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
          heading={pageData.board.sectionHeading}
          summary={pageData.board.introPortableText}
          background={"teachersPastelYellow"}
        >
          <ButtonLinkNav $mt={36} buttons={aboutNavLinks} selected={"board"} />
        </SummaryCard>
        <AboutIntroCard
          image={{
            imageSrc: "/images/illustrations/work-with-us.svg",
            alt: "work with us illustration",
          }}
          bodyPortableText={pageData.board.introPortableText}
        />

        <Heading $mb={[0, 32]} $fontSize={[20, 24]} tag={"h3"}>
          {pageData.board.sectionHeading}
        </Heading>

        <Flex $width={"100%"} $justifyContent={"flex-start"}>
          <Heading $mb={20} $fontSize={24} tag={"h4"}>
            Documents
          </Heading>
        </Flex>
        <Hr></Hr>
        <Grid $cg={20}>
          {pageData.board.documents.map((doc) => (
            <Fragment key={doc.title}>
              <GridArea $colSpan={[6, 2]}>
                <Card $height={220} $pa={16}>
                  <BoxBorders />
                  <Flex
                    $justifyContent={"space-between"}
                    $height={"100%"}
                    $flexDirection={"column"}
                  >
                    <Heading $fontSize={16} $lineHeight={"20px"} tag={"h4"}>
                      {doc.title}
                    </Heading>

                    <Flex>
                      <P>{`${doc.file.asset.size}mb ${doc.file.asset.extension}`}</P>
                      <IconButtonAsLink
                        icon={"ArrowDown"}
                        aria-label={""}
                        href={`${doc.file.asset.url}?dl`}
                      />
                    </Flex>
                  </Flex>
                </Card>
              </GridArea>
            </Fragment>
          ))}
        </Grid>
        <Card $ph={[0, 80]} $width={["100%", "75%"]}>
          <Heading $mb={20} $fontSize={24} tag={"h4"}>
            Governance
          </Heading>
          <Typography $fontSize={[18, 16]}>
            <PortableText value={pageData.board.governancePortableText} />
          </Typography>
        </Card>

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
