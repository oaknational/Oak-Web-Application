import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakMaxWidth,
  OakFlex,
} from "@oaknational/oak-components";

import CMSClient from "@/node-lib/cms";
import { PlanningPage } from "@/common-lib/cms-types";
import Layout from "@/components/AppComponents/Layout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getPageProps from "@/node-lib/getPageProps";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";

export type PlanALessonProps = {
  pageData: PlanningPage;
};

// This is the new plan a lesson page currently a template for the layout
const PlanALesson: NextPage<PlanALessonProps> = ({ pageData }) => {
  return (
    <Layout
      seoProps={{
        ...getSeoProps(pageData.seo),
        ...{ noFollow: true, noIndex: true },
      }}
      $background={"white"}
    >
      <OakMaxWidth $pt={"inner-padding-xl"} $pb={"inner-padding-l"}>
        <Breadcrumbs
          breadcrumbs={[
            {
              oakLinkProps: {
                page: "home",
              },
              label: "Home",
            },

            {
              oakLinkProps: {
                page: "lesson-planning",
              },
              label: "Plan a lesson",
              disabled: true,
            },
          ]}
        />
        <OakFlex
          $ba={"border-solid-l"}
          $borderColor={"grey60"}
          $justifyContent={"center"}
          $alignItems={"center"}
          $height={"all-spacing-14"}
          $mb={"space-between-l"}
        >
          <OakHeading tag={"h1"} $font={"heading-1"}>
            {"hero"}
          </OakHeading>
        </OakFlex>
        <OakGrid>
          <OakGridArea
            $ba={"border-solid-l"}
            $borderColor={"grey60"}
            $colSpan={[12, 12, 3]}
          >
            <OakHeading tag={"h3"} $font={"heading-7"}>
              {"Contents in heading 7 style"}
            </OakHeading>
            <OakFlex>{"sticky nav"}</OakFlex>
          </OakGridArea>
          <OakGridArea
            $ba={"border-solid-l"}
            $borderColor={"grey60"}
            $colSpan={[12, 12, 6]}
            $colStart={[1, 1, 5]}
          >
            <OakHeading tag={"h2"} $font={"heading-4"}>
              {"H2 Section title"}
            </OakHeading>
            <OakFlex>{"cms content block section"}</OakFlex>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PlanALessonProps> = async (
  context,
) => {
  return getPageProps({
    page: "lesson-planning::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const planningPage = await CMSClient.planningPage({
        previewMode: isPreviewMode,
      });

      if (!planningPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<PlanALessonProps> = {
        props: {
          pageData: planningPage,
        },
      };

      return results;
    },
  });
};

export default PlanALesson;
