import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakMaxWidth,
  OakFlex,
  OakTertiaryOLNav,
  OakThemeProvider,
  oakDefaultTheme,
  OakAnchorTarget,
  OakLink,
} from "@oaknational/oak-components";

import Layout from "@/components/AppComponents/Layout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getPageProps from "@/node-lib/getPageProps";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import CMSClient from "@/node-lib/cms";
import { PlanALessonPage } from "@/common-lib/cms-types/planALessonPage";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { getNavItems } from "@/pages-helpers/homesite/plan-a-lesson/getNavItems";

export type PlanALessonProps = {
  pageData: PlanALessonPage;
};

const PlanALesson: NextPage<PlanALessonProps> = ({ pageData }) => {
  const navItems = getNavItems({ pageData });

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
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
        </OakMaxWidth>
        <OakFlex
          $background={"bg-decorative3-very-subdued"}
          $display={["block", "block", "none"]}
          $pv={"inner-padding-xl"}
          $ph={["inner-padding-m", "inner-padding-none", "inner-padding-none"]}
        >
          <OakMaxWidth>
            <OakTertiaryOLNav
              items={navItems}
              ariaLabel="plan a lesson contents"
              title={"Contents"}
              anchorTarget="plan-a-lesson-contents"
            />
          </OakMaxWidth>
        </OakFlex>

        <OakMaxWidth>
          <OakGrid>
            <OakGridArea
              $colSpan={[12, 3]}
              $alignSelf={"start"}
              $position={["static", "static", "sticky"]}
              $top={"all-spacing-10"}
              $display={["none", "none", "block"]}
            >
              <OakTertiaryOLNav
                items={navItems}
                ariaLabel="plan a lesson contents"
                title={"Contents"}
                anchorTarget="#plan-a-lesson-contents"
              />
            </OakGridArea>
            <OakGridArea
              $ba={"border-solid-l"}
              $borderColor={"grey60"}
              $colSpan={[12, 12, 6]}
              $colStart={[1, 1, 5]}
            >
              <OakFlex $flexDirection={"column"}>
                {pageData.content.map((section, index) => (
                  <OakFlex
                    $flexDirection={"column"}
                    $height={"all-spacing-18"}
                    key={index}
                    $position={"relative"}
                  >
                    {section.type === "PlanALessonPageContent" && (
                      <OakAnchorTarget id={section.anchorSlug.current} />
                    )}
                    {section.type === "PlanALessonPageContent" && (
                      <p>{section.anchorSlug.current}</p>
                    )}

                    <OakHeading tag={"h3"} $font={"heading-5"}>
                      {section.navigationTitle}
                    </OakHeading>

                    <PortableTextWithDefaults
                      value={section.bodyPortableText}
                    />
                    <OakLink
                      iconName="chevron-up"
                      href={"#plan-a-lesson-contents"}
                    >
                      {"Back to contents"}
                    </OakLink>
                  </OakFlex>
                ))}
              </OakFlex>
            </OakGridArea>
          </OakGrid>
        </OakMaxWidth>
      </Layout>
    </OakThemeProvider>
  );
};

export const getStaticProps: GetStaticProps<PlanALessonProps> = async (
  context,
) => {
  return getPageProps({
    page: "lesson-planning-new::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;
      const planALessonPage = await CMSClient.planALessonPage({
        previewMode: isPreviewMode,
      });

      if (!planALessonPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<PlanALessonProps> = {
        props: {
          pageData: planALessonPage,
        },
      };

      return results;
    },
  });
};

export default PlanALesson;
