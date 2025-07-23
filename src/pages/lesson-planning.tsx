import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import {
  OakGrid,
  OakGridArea,
  OakMaxWidth,
  OakFlex,
  OakTertiaryOLNav,
  OakAnchorTarget,
  OakHeaderHero,
  OakBox,
  OakLink,
} from "@oaknational/oak-components";

import Layout from "@/components/AppComponents/Layout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getPageProps from "@/node-lib/getPageProps";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import CMSClient from "@/node-lib/cms";
import { PlanALessonPage } from "@/common-lib/cms-types/planALessonPage";
import { getNavItems } from "@/pages-helpers/home/plan-a-lesson/getNavItems";
import LessonPlanningBlog from "@/components/GenericPagesComponents/LessonPlanningBlog";
import { LandingPageSignUpForm } from "@/components/GenericPagesComponents/LandingPageSignUpForm";
import { imageBuilder } from "@/components/HooksAndUtils/sanityImageBuilder";
import usePostList from "@/components/SharedComponents/PostList/usePostList";
import BlogAndWebinarList from "@/components/GenericPagesComponents/BlogAndWebinarList";
import { getAndMergeWebinarsAndBlogs } from "@/utils/getAndMergeWebinarsAndBlogs";
import { postToPostListItem } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import { SerializedPost } from "@/pages-helpers/home/getBlogPosts";

export type PlanALessonProps = {
  pageData: PlanALessonPage;
  posts: SerializedPost[];
};

const PlanALesson: NextPage<PlanALessonProps> = ({ pageData, posts }) => {
  const navItems = getNavItems({ ...pageData });

  const blogs = posts.map(postToPostListItem);

  const blogListPosts = usePostList({
    items: blogs,
    withImage: true,
  });

  return (
    <Layout
      seoProps={{
        ...getSeoProps(pageData.seo),
      }}
      $background={"white"}
    >
      <OakHeaderHero
        heroImageAlt={pageData.hero.image?.altText ?? ""}
        data-testid="header-hero"
        headingTitle={pageData.hero.heading}
        authorName={pageData.hero.author.name}
        authorTitle={pageData.hero.author.role ?? ""}
        authorImageSrc={
          pageData.hero.author.image?.asset
            ? imageBuilder.image(pageData.hero.author.image.asset).url()
            : undefined
        }
        authorImageAlt={`${pageData.hero.author.name} profile picture`}
        subHeadingText={
          pageData.hero.summaryPortableText?.[0]?.children?.[0]?.text
        }
        heroImageSrc={imageBuilder
          .image(pageData.hero.image?.asset?.url ?? {})
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
            anchorTarget={"plan-a-lesson-contents"}
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
              anchorTarget="plan-a-lesson-contents"
            />
          </OakGridArea>

          <OakGridArea
            $colSpan={[12, 12, 6]}
            $colStart={[1, 1, 5]}
            $mh={["space-between-s", null, null]}
            $justifyContent={"center"}
          >
            <OakFlex
              $width={"100%"}
              $flexDirection={"column"}
              $alignItems={"center"}
            >
              <OakFlex
                $minWidth={[null, "all-spacing-22"]}
                $maxWidth={"all-spacing-22"}
                $width={"100%"}
                $flexDirection={"column"}
              >
                {pageData.content.map((section, index, sections) => {
                  const isLastSection = index === sections.length - 1;
                  if (section.type === "PlanALessonPageFormBlock") {
                    return (
                      <OakFlex
                        $width={"100%"}
                        key={`${section.navigationTitle} ${index}`}
                        data-testid="lesson-section"
                        $mb={
                          !isLastSection
                            ? "space-between-xxxl"
                            : "space-between-m2"
                        }
                        $flexDirection={"column"}
                      >
                        <LandingPageSignUpForm
                          formTitle={"Don't miss out"}
                          dontDescribe={true}
                        />
                      </OakFlex>
                    );
                  }

                  return (
                    <OakBox
                      key={`${section.navigationTitle} ${index}`}
                      $position={"relative"}
                      $width={"100%"}
                      data-testid="lesson-section"
                      $mb={
                        !isLastSection
                          ? "space-between-xxxl"
                          : "space-between-m2"
                      }
                    >
                      <OakAnchorTarget id={section.anchorSlug.current} />
                      <LessonPlanningBlog
                        title={section.navigationTitle}
                        blogPortableText={section.bodyPortableText}
                      />
                      <OakBox
                        $display={["block", "block", "none"]}
                        $mt={"space-between-m2"}
                      >
                        <OakLink
                          iconName="arrow-up"
                          href={"#plan-a-lesson-contents"}
                          isTrailingIcon
                        >
                          {"Back to contents"}
                        </OakLink>
                      </OakBox>
                    </OakBox>
                  );
                })}
              </OakFlex>
            </OakFlex>
          </OakGridArea>
        </OakGrid>
        <BlogAndWebinarList
          backgroundColor={"grey20"}
          showImageOnTablet
          blogListPosts={blogListPosts}
          displayOnPhone={true}
          title={"Latest lesson planning blogs"}
        />
      </OakMaxWidth>
    </Layout>
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

      const posts = await getAndMergeWebinarsAndBlogs(
        isPreviewMode,
        undefined,
        "lesson-planning",
      );
      const results: GetStaticPropsResult<PlanALessonProps> = {
        props: {
          pageData: planALessonPage,
          posts,
        },
      };

      return results;
    },
  });
};

export default PlanALesson;
