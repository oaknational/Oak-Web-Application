import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";

import CMSClient, { AboutBoardPage } from "../../node-lib/cms";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Card from "../../components/Card";
import AboutContactCard from "../../components/AboutContactCard";
import Typography, {
  Heading,
  Hr,
  LI,
  P,
  UL,
} from "../../components/Typography";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import BoxBorders from "../../components/SpriteSheet/BrushSvgs/BoxBorders";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";
import IconButtonAsLink from "../../components/Button/IconButtonAsLink";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import AboutUsSummaryCard from "../../components/pages/AboutUs/AboutUsSummaryCard";

export type AboutPageProps = {
  pageData: AboutBoardPage;
};

const AboutUsBoard: NextPage<AboutPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <MaxWidth $pt={[64, 80]}>
        <AboutUsSummaryCard {...pageData} />
        <AboutIntroCard
          image={{
            imageSrc: "/images/illustrations/work-with-us-500.png",
            alt: "illustration of four people carrying a floor, on which people are working at desks, and one person is painting at an easel",
            priority: true,
          }}
          bodyPortableText={pageData.introPortableText}
        />

        <Heading $mb={[40, 32]} $font={["heading-6", "heading-5"]} tag={"h2"}>
          Our interim board
        </Heading>

        <UL $mb={[80, 92]} $reset>
          {pageData.boardMembers?.map((boardMember) => (
            <LI
              key={boardMember.id}
              $textAlign="center"
              $font={["heading-7", "heading-6"]}
            >
              {boardMember.name}
            </LI>
          ))}
        </UL>

        <Flex $width={"100%"} $justifyContent={["center", "flex-start"]}>
          <Heading $font={"heading-5"} tag={"h2"}>
            Documents
          </Heading>
        </Flex>
        <Flex $mh={[16, 0]} $flexDirection={"column"}>
          <Typography $width={"100%"}>
            <Hr $color={"pastelTurqoise"} $mv={32} />
          </Typography>

          <Grid $rg={[16]} $cg={[12, 20]}>
            {pageData.documents.map((doc) => {
              const fileSizeInMB = (doc.file.asset.size / 1012 / 1012).toFixed(
                1
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
                          icon={"Download"}
                          aria-label={`Download ${doc.title} as ${fileSizeInMB} megabyte ${doc.file.asset.extension}`}
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
            <Hr $color={"pastelTurqoise"} $mv={0} $mt={32} />
          </Typography>
        </Flex>
        <Card $pv={0} $mv={[80, 92]} $ph={[16, 80]} $width={["100%", "70%"]}>
          <Heading $mb={20} $font={"heading-5"} tag={"h2"}>
            Governance
          </Heading>

          <Typography $font={["body-1", "body-2"]}>
            <PortableText value={pageData.governancePortableText} />
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

  const aboutBoardPage = await CMSClient.aboutBoardPage({
    previewMode: isPreviewMode,
  });

  if (!aboutBoardPage) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: aboutBoardPage,
    },
    revalidate: 10,
  };
};

export default AboutUsBoard;
