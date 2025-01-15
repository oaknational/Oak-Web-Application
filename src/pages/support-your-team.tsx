import React from "react";
import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakFlex,
  OakMaxWidth,
} from "@oaknational/oak-components";

import CMSClient from "@/node-lib/cms";
import { SupportPage } from "@/common-lib/cms-types";
import SummaryCard from "@/components/SharedComponents/Card/SummaryCard";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { SupportYourTeamTextBlockCard } from "@/components/GenericPagesComponents/SupportYourTeamTextBlockCard/SupportYourTeamTextBlockCard";
import SupportYourTeamTextBlockCardImageCta from "@/components/GenericPagesComponents/SupportYourTeamTextBlockCardImageCta";
import SupportYourTeamBubbleMessage from "@/components/GenericPagesComponents/SupportYourTeamBubbleMessage";
import getPageProps from "@/node-lib/getPageProps";
import Layout from "@/components/AppComponents/Layout";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export type SupportPageProps = {
  pageData: SupportPage;
};

const Support: NextPage<SupportPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <OakMaxWidth
        $ph={["inner-padding-none", "inner-padding-m"]}
        $pt={["inner-padding-xl6", "inner-padding-xl8"]}
      >
        <SummaryCard {...pageData} />
        <Flex
          $justifyContent="center"
          $maxWidth={["100%", 450]}
          $mh="auto"
          $pt={64}
          $pb={96}
          $ph={12}
        >
          <OakHeading
            $font={["heading-5", "heading-4"]}
            $textAlign="center"
            tag="h2"
          >
            Using Oak in your school could have a big impact
          </OakHeading>
        </Flex>
        <OakFlex $justifyContent={"center"}>
          <OakFlex $flexDirection={["column", "row", "row"]}>
            <SupportYourTeamBubbleMessage
              background={"aqua"}
              variant="bubble-1"
              outlineHeading={"3 hrs"}
              heading={"per week saved on lesson planning"}
              subHeading={"by nearly half of teachers using Oak"}
              $mr={"space-between-s"}
            />
            <SupportYourTeamBubbleMessage
              background={"pink50"}
              variant="bubble-2"
              outlineHeading={"50%"}
              heading={"of teachers feel more confident"}
              subHeading={"in curriculum design"}
              $mr={[
                "space-between-none",
                "space-between-none",
                "space-between-ssx",
              ]}
            />
          </OakFlex>
        </OakFlex>
        <OakFlex $justifyContent={"center"}>
          <ButtonAsLink
            $mt={32}
            $mb={92}
            page={"home"}
            label={"Search our lessons"}
            icon={"arrow-right"}
            $iconPosition={"trailing"}
          />
        </OakFlex>
        <OakGrid
          $mb={"space-between-xl"}
          $rg={"all-spacing-10"}
          $cg={["all-spacing-0", "all-spacing-8"]}
        >
          <OakGridArea $colSpan={[12, 12, 6]}>
            <SupportYourTeamTextBlockCard
              background={"lemon50"}
              {...pageData.planning}
            />
          </OakGridArea>
          <OakGridArea $colSpan={[12, 12, 6]}>
            <SupportYourTeamTextBlockCard
              background={"lemon50"}
              {...pageData.cover}
            />
          </OakGridArea>
        </OakGrid>
        <SupportYourTeamTextBlockCardImageCta
          {...pageData.curriculum}
          background={"aqua"}
          image={{
            illustration: "jigsaw-desk-with-extra-piece",
            sizes: "(min-width: 750px) 720px, 100vw",
          }}
        />
        <SupportYourTeamTextBlockCardImageCta
          {...pageData.development}
          background={"pink50"}
          image={{
            illustration: "supporting",
            sizes: "(min-width: 750px) 720px, 100vw",
          }}
          imageContainerProps={{
            $maxHeight: [null, null, 150],
          }}
        />
        <OakFlex
          $alignItems={"center"}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $mt="space-between-l"
        >
          <Box $maxWidth={["100%", 380, 380]}>
            <OakHeading
              $textAlign={"center"}
              $font={["heading-5", "heading-4"]}
              $mb="space-between-m"
              tag={"h2"}
            >
              Start using Oak today
            </OakHeading>
            <OakP $textAlign={"center"} $font={"body-2"}>
              Search our lessons to find all the resources you need to support
              your team.
            </OakP>
            <OakFlex $justifyContent={"center"}>
              <ButtonAsLink
                $mt={32}
                $mb={92}
                page={"home"}
                label={"Search our lessons"}
                icon={"arrow-right"}
                $iconPosition={"trailing"}
              />
            </OakFlex>
          </Box>
        </OakFlex>
      </OakMaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<SupportPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "support-your-team::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const supportPage = await CMSClient.supportPage({
        previewMode: isPreviewMode,
      });

      if (!supportPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<SupportPageProps> = {
        props: {
          pageData: supportPage,
        },
      };
      return results;
    },
  });
};

export default Support;
