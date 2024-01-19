import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { OakFlex, OakMaxWidth } from "@oak-academy/oak-components";

import CMSClient from "@/node-lib/cms";
import { AboutBoardPage } from "@/common-lib/cms-types";
import Layout from "@/components/AppComponents/Layout";
import Card from "@/components/SharedComponents/Card";
import GenericContactCard from "@/components/GenericPagesComponents/GenericContactCard";
import Typography, {
  Heading,
  Hr,
  P,
} from "@/components/SharedComponents/Typography";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import GenericIntroCard from "@/components/GenericPagesComponents/GenericIntroCard";
import IconButtonAsLink from "@/components/SharedComponents/Button/IconButtonAsLink";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import BioCardList from "@/components/GenericPagesComponents/BioCardList";
import GenericSummaryCard from "@/components/GenericPagesComponents/GenericSummaryCard";
import getPageProps from "@/node-lib/getPageProps";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { GridList } from "@/components/SharedComponents/Typography/UL";
import { GridAreaListItem } from "@/components/SharedComponents/Typography/LI";

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
    boardHeader,
  } = pageData;

  const bioModalsEnabled = useFeatureFlagEnabled("about-us--board--bio-modals");
  return (
    <Layout seoProps={getSeoProps(seo)} $background={"white"}>
      <OakMaxWidth
        $mb={["space-between-xl", "space-between-xxxl"]}
        $mt={["space-between-xl", "space-between-xxxl"]}
      >
        <GenericSummaryCard {...pageData} />
        <GenericIntroCard
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
              {boardHeader}
            </Heading>
            <BioCardList
              $mb={[80, 60]}
              $ph={[16, 0]}
              bios={boardMembers}
              withModals={bioModalsEnabled}
            />
          </>
        )}
        <Heading $font={"heading-5"} tag={"h2"} $textAlign={["center", "left"]}>
          Documents
        </Heading>
        <OakFlex
          $mh={["space-between-s", "space-between-none"]}
          $flexDirection={"column"}
        >
          <Typography $width={"100%"}>
            <Hr $color={"aqua"} $mv={32} />
          </Typography>

          <GridList $rg={[16]} $cg={[12, 20]}>
            {documents.map((doc) => {
              const fileSizeInMB = (doc.file.asset.size / 1012 / 1012).toFixed(
                1,
              );
              return (
                <GridAreaListItem key={doc.title} $colSpan={[6, 3, 2]}>
                  <Card $height={220} $pa={16}>
                    <BoxBorders gapPosition="rightTop" />
                    <OakFlex
                      $justifyContent={"space-between"}
                      $flexDirection={"column"}
                      $height={"100%"}
                    >
                      <Heading $font={"heading-7"} tag={"h3"}>
                        {doc.title}
                      </Heading>
                      <OakFlex
                        $alignItems={"center"}
                        $justifyContent={"space-between"}
                      >
                        <P>{`${fileSizeInMB}MB ${doc.file.asset.extension.toUpperCase()}`}</P>
                        <IconButtonAsLink
                          icon={"download"}
                          aria-label={`Download ${doc.title} as ${fileSizeInMB} megabyte ${doc.file.asset.extension}`}
                          page={null}
                          href={`${doc.file.asset.url}?dl`}
                          background={"blue"}
                        />
                      </OakFlex>
                    </OakFlex>
                  </Card>
                </GridAreaListItem>
              );
            })}
          </GridList>
          <Typography $width={"100%"}>
            <Hr $color={"aqua"} $mv={0} $mt={32} />
          </Typography>
        </OakFlex>
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
            <PortableTextWithDefaults
              value={governancePortableText}
              withoutDefaultComponents
            />
          </Typography>
        </Card>
        <GenericContactCard {...pageData.contactSection} />
      </OakMaxWidth>
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
