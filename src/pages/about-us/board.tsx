import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  OakFlex,
  OakMaxWidth,
  OakHeading,
  OakP,
  OakTypography,
  OakHandDrawnHR,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";

import CMSClient from "@/node-lib/cms";
import { AboutBoardPage } from "@/common-lib/cms-types";
import Layout from "@/components/AppComponents/Layout";
import Card from "@/components/SharedComponents/Card";
import GenericContactCard from "@/components/GenericPagesComponents/GenericContactCard";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import GenericIntroCard from "@/components/GenericPagesComponents/GenericIntroCard";
import IconButtonAsLink from "@/components/SharedComponents/Button/IconButtonAsLink";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import BioCardList from "@/components/GenericPagesComponents/BioCardList";
import GenericSummaryCard from "@/components/GenericPagesComponents/GenericSummaryCard";
import getPageProps from "@/node-lib/getPageProps";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

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
            <OakHeading
              $mb={["space-between-l", "space-between-m2"]}
              $font={["heading-6", "heading-5"]}
              tag={"h2"}
              $textAlign={["center"]}
            >
              {boardHeader}
            </OakHeading>
            <BioCardList
              $mb={["space-between-xxxl", "space-between-xl"]}
              $ph={["inner-padding-m", "inner-padding-none"]}
              bios={boardMembers}
              withModals={bioModalsEnabled}
            />
          </>
        )}
        <OakHeading
          $font={"heading-5"}
          tag={"h2"}
          $textAlign={["center", "left"]}
        >
          Documents
        </OakHeading>
        <OakFlex
          $mh={["space-between-s", "space-between-none"]}
          $flexDirection={"column"}
        >
          <OakTypography $width={"100%"}>
            <OakHandDrawnHR
              hrColor={"aqua"}
              $mv={"space-between-m2"}
              $height={"all-spacing-05"}
            />
          </OakTypography>

          <OakGrid
            $rg={"all-spacing-4"}
            $cg={["all-spacing-3", "all-spacing-5"]}
          >
            {documents.map((doc) => {
              const fileSizeInMB = (doc.file.asset.size / 1012 / 1012).toFixed(
                1,
              );
              return (
                <OakGridArea key={doc.title} $colSpan={[6, 3, 2]}>
                  <Card $height={220} $pa={16}>
                    <BoxBorders gapPosition="rightTop" />
                    <OakFlex
                      $justifyContent={"space-between"}
                      $flexDirection={"column"}
                      $height={"100%"}
                    >
                      <OakP $font={"heading-7"}>{doc.title}</OakP>
                      <OakFlex
                        $alignItems={"center"}
                        $justifyContent={"space-between"}
                      >
                        <OakP>{`${fileSizeInMB}MB ${doc.file.asset.extension.toUpperCase()}`}</OakP>
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
                </OakGridArea>
              );
            })}
          </OakGrid>
          <OakTypography $width={"100%"}>
            <OakHandDrawnHR
              hrColor={"aqua"}
              $mv={"space-between-m2"}
              $height={"all-spacing-05"}
            />
          </OakTypography>
        </OakFlex>
        <Card
          $mh="auto"
          $mv={[80, 92]}
          $ph={[16, 80]}
          $pv={0}
          $width={["100%", "70%"]}
        >
          <OakHeading $mb={"space-between-m"} $font={"heading-5"} tag={"h2"}>
            Governance
          </OakHeading>
          <OakTypography $font={["body-1", "body-2"]}>
            <PortableTextWithDefaults
              value={governancePortableText}
              withoutDefaultComponents
            />
          </OakTypography>
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
