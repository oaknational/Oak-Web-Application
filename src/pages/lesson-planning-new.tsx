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
  OakBox,
  OakLink,
  OakHeading,
  OakTypography,
} from "@oaknational/oak-components";

import { postToPostListItem, SerializedPost, sortByDate } from ".";

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
import usePostList from "@/components/SharedComponents/PostList/usePostList";
import PostList from "@/components/SharedComponents/PostList";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { serializeDate } from "@/utils/serializeDate";

export type PlanALessonProps = {
  pageData: PlanALessonPage;
  posts: SerializedPost[];
};

const getLessonPlanningBlogsWebinars = async (isPreviewMode: boolean) => {
  const blogs = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
  });

  const blogRes = blogs
    .map((blog) => ({
      ...blog,
      type: "blog-post" as const,
    }))
    .filter((blog) => blog.category.slug === "lesson-planning");

  const webinars = await CMSClient.webinars({
    previewMode: isPreviewMode,
  });

  const webinarsRes = webinars
    .map((webinar) => ({
      ...webinar,
      type: "webinar" as const,
    }))
    .filter(
      (webinar) =>
        webinar.date.getTime() < new Date().getTime() &&
        webinar.category.slug === "lesson-planning",
    );

  return [...blogRes, ...webinarsRes]
    .sort(sortByDate)
    .slice(0, 4)
    .map(serializeDate);
};

const PlanALesson: NextPage<PlanALessonProps> = ({ pageData, posts }) => {
  const navItems = getNavItems({ ...pageData });
  const isNewsletterForm = pageData.content.some((section) => {
    return section.type === "PlanALessonPageFormBlock";
  });

  const blogs = posts.map(postToPostListItem);

  const blogListPosts = usePostList({
    items: blogs,
    withImage: true,
  });

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
          authorTitle={pageData.hero.author.role ?? ""}
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
              $mb={"space-between-l"}
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
              $mh={"space-between-s"}
            >
              {pageData.content.map((section) => {
                if (section.type === "PlanALessonPageFormBlock") {
                  return (
                    <OakFlex
                      $mb={"space-between-xxxl"}
                      $flexDirection={"column"}
                      $display={["none", "none", "flex"]}
                    >
                      <LandingPageSignUpForm formTitle={"Don't miss out"} />
                    </OakFlex>
                  );
                }

                return (
                  <OakBox $position={"relative"} $mb={"space-between-xxxl"}>
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
                        iconName="chevron-up"
                        href={"#plan-a-lesson-contents"}
                        isTrailingIcon
                      >
                        {"Back to contents"}
                      </OakLink>
                    </OakBox>
                  </OakBox>
                );
              })}
              {isNewsletterForm && (
                <OakBox
                  $mb={"space-between-l"}
                  $display={["block", "none", "none"]}
                >
                  <LandingPageSignUpForm formTitle="Don't miss out" />
                </OakBox>
              )}
            </OakGridArea>
          </OakGrid>
          <OakBox
            $pa={"inner-padding-xl"}
            $background={"bg-neutral"}
            $borderRadius={"border-radius-l"}
            $mb={"space-between-l"}
            $display={["none", "none", "block"]}
          >
            <OakFlex
              $width={"100%"}
              $alignItems={["flex-start", "center"]}
              $justifyContent={"space-between"}
              $mb={"space-between-l"}
              $flexDirection={["column", "row"]}
            >
              <OakHeading tag="h2" $font={"heading-5"}>
                Stay up to date
              </OakHeading>
              <OakFlex $flexDirection={"row"}>
                <OakTypography $mr={"space-between-s"} $font={"heading-7"}>
                  <OwaLink page={"webinar-index"}>All webinars</OwaLink>
                </OakTypography>
                <OakTypography $font={"heading-7"}>
                  <OwaLink page={"blog-index"}>All blogs</OwaLink>
                </OakTypography>
              </OakFlex>
            </OakFlex>
            <PostList showImageOnTablet={true} {...blogListPosts} />
          </OakBox>
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

      const posts = await getLessonPlanningBlogsWebinars(isPreviewMode);

      if (!planALessonPage) {
        return {
          notFound: true,
        };
      }

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
