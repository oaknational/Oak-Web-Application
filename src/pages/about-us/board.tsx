import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";

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
import { reducedAboutNavLinks } from "../../browser-lib/fixtures/aboutNav";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";
import IconButtonAsLink from "../../components/Button/IconButtonAsLink";
import Box from "../../components/Box";

export type AboutPageProps = {
  pageData: AboutPage;
  isPreviewMode: boolean;
};

const AboutUsBoard: NextPage<AboutPageProps> = ({
  pageData,
  isPreviewMode,
}) => {
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
          imageProps={{
            src: "/images/oak-logo.svg",
            alt: "who we are illustration",
          }}
        >
          <ButtonLinkNav
            $mt={36}
            buttons={reducedAboutNavLinks}
            selected={"board"}
          />
        </SummaryCard>
        <AboutIntroCard
          image={{
            imageSrc: "/images/illustrations/work-with-us.svg",
            alt: "work with us illustration",
          }}
          bodyPortableText={pageData.board.introPortableText}
        />

        <Heading $mb={[40, 32]} $fontSize={[20, 24]} tag={"h3"}>
          {pageData.board.sectionHeading}
        </Heading>

        <Box $mb={[80, 92]}>
          {pageData.board.boardMembers?.map((boardMember) => (
            <Heading tag={"h4"} $fontSize={[24, 32]}>
              {boardMember.name}
            </Heading>
          ))}
        </Box>

        <Flex $width={"100%"} $justifyContent={["center", "flex-start"]}>
          <Heading $fontSize={24} tag={"h4"}>
            Documents
          </Heading>
        </Flex>
        <Typography $width={"100%"}>
          <Hr $mv={32} />
        </Typography>

        <Grid $cg={20}>
          {pageData.board.documents.map((doc) => (
            <GridArea key={doc.title} $colSpan={[6, 2]}>
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
                  <Flex
                    $alignItems={"center"}
                    $justifyContent={"space-between"}
                  >
                    <P>{`${(doc.file.asset.size / 1012 / 1012).toFixed(1)}mb ${
                      doc.file.asset.extension
                    }`}</P>
                    <IconButtonAsLink
                      icon={"Download"}
                      aria-label={""}
                      href={`${doc.file.asset.url}?dl`}
                      background={"teachersHighlight"}
                    />
                  </Flex>
                </Flex>
              </Card>
            </GridArea>
          ))}
        </Grid>
        <Typography $width={"100%"}>
          <Hr $mv={0} $mt={32} />
        </Typography>
        <Card $pv={0} $mv={[80, 92]} $ph={[0, 80]} $width={["100%", "70%"]}>
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
