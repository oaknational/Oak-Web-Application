import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import {
  OakGrid,
  OakGridArea,
  OakMaxWidth,
  OakFlex,
  OakTertiaryOLNav,
  OakThemeProvider,
  oakDefaultTheme,
  OakAnchorTarget,
  OakHeaderHero,
} from "@oaknational/oak-components";

import Layout from "@/components/AppComponents/Layout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getPageProps from "@/node-lib/getPageProps";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import CMSClient from "@/node-lib/cms";
import { PlanALessonPage } from "@/common-lib/cms-types/planALessonPage";
import { getNavItems } from "@/pages-helpers/homesite/plan-a-lesson/getNavItems";
import LessonPlanningBlog from "@/components/GenericPagesComponents/LessonPlanningBlog";
import { LandingPageSignUpForm } from "@/components/GenericPagesComponents/LandingPageSignUpForm";
import { imageBuilder } from "@/components/SharedComponents/CMSImage/sanityImageBuilder";

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
        <OakHeaderHero
          headingTitle={pageData.hero.heading}
          authorName={pageData.hero.author.name}
          authorTitle={pageData.hero.author.role}
          subHeadingText={
            pageData.hero.summaryPortableText?.[0]?.children?.[0]?.text
          }
          heroImageSrc={imageBuilder
            .image(pageData.hero.image?.asset?.url ?? {})
            .url()}
          authorImageSrc={imageBuilder
            .image(pageData.hero.author.image?.asset?.url ?? {})
            .url()}
          breadcrumbs={
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
          }
        />
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

        <OakMaxWidth $height={"auto"}>
          <OakGrid $mt={"space-between-l"} $position={"relative"}>
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
            <OakGridArea $colSpan={[12, 12, 6]} $colStart={[1, 1, 5]}>
              {pageData.content.map((section) => {
                if (section.type === "PlanALessonPageFormBlock") {
                  return (
                    <OakFlex
                      $mb={"space-between-xxxl"}
                      $flexDirection={"column"}
                      $mh={"space-between-m"}
                    >
                      <LandingPageSignUpForm formTitle={section.form.title} />
                    </OakFlex>
                  );
                }
                return (
                  <>
                    <LessonPlanningBlog
                      title={section.navigationTitle}
                      blogPortableText={section.bodyPortableText}
                      anchorId={section.anchorSlug.current}
                      linkHref={"#plan-a-lesson-contents"}
                    />
                    <OakAnchorTarget id={section.anchorSlug.current} />
                  </>
                );
              })}
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
