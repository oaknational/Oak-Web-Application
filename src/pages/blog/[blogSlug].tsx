import React from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useNextSanityImage } from "next-sanity-image";
import { useTheme } from "styled-components";
import { uniqBy } from "lodash/fp";

import Layout from "../../components/Layout";
import CMSClient, { BlogPost } from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Box from "../../components/Box";
import CopyLinkButton from "../../components/Button/CopyLinkButton";
import { BlogJsonLd } from "../../browser-lib/seo/getJsonLd";
import BlogCategoryList from "../../components/Blog/BlogCategoryList";
import useBlogCategoryList from "../../components/Blog/BlogCategoryList/useBlogCategoryList";
import AvatarImage from "../../components/AvatarImage";
import { getBlogPostBreadcrumbs } from "../../components/pages/getBlogBreadcrumbs";
import BlogPortableText from "../../components/Blog/BlogPortableText/BlogPortableText";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import MobileBlogFilters from "../../components/MobileBlogFilters";
import { Heading, Span, P } from "../../components/Typography";
import OakLink from "../../components/OakLink";
import { sanityClientLike } from "../../components/CMSImage";

export type SerializedBlog = Omit<BlogPost, "date"> & {
  date: string;
};

export type BlogPageProps = {
  blog: SerializedBlog;
  categories: { title: string; slug: string }[];
};

const BlogDetailPage: NextPage<BlogPageProps> = (props) => {
  const { blog, categories } = props;

  const blogCategoriesListProps = useBlogCategoryList();
  const formattedDate = new Date(blog.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /**
   * @todo add various sizes for sharing on different platforms
   * Possibly add options on CMS too, at the moment it crops images
   * 2:1 (optimised for twitter)
   */
  const sharingImage = useNextSanityImage(
    sanityClientLike,
    props.blog.mainImage,
    {
      imageBuilder: (imageUrlBuilder) =>
        imageUrlBuilder.width(1400).height(700).fit("crop").crop("center"),
    }
  );
  const theme = useTheme();
  const HEADER_HEIGHT = theme.header.height;

  return (
    <Layout
      seoProps={getSeoProps({
        ...props.blog.seo,
        title: props.blog.seo?.title || props.blog.title,
        description: props.blog.seo?.description || props.blog.summary,
        imageUrl: sharingImage.src,
      })}
      $background="white"
      breadcrumbs={getBlogPostBreadcrumbs(categories, blog)}
    >
      <MobileBlogFilters categoryListProps={{ categories }} withBackButton />
      <MaxWidth>
        <Grid $ph={[12, 0]}>
          <GridArea $order={[0, 2]} $colSpan={[12, 3]}>
            <Box
              $display={["none", "block"]}
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $pt={[48, 72]}
            >
              <Heading
                tag="h3"
                $font="body-3"
                id={blogCategoriesListProps.labelId}
              >
                Categories
              </Heading>
              <BlogCategoryList
                labelledBy={blogCategoriesListProps.labelId}
                $mt={24}
                categories={categories}
              />
            </Box>
          </GridArea>
          <GridArea $order={[0, 1]} $colSpan={[12, 2]} />
          <GridArea $order={[1, 0]} $colSpan={[12, 7]}>
            <Flex
              $mt={[40, 72]}
              $justifyContent="space-between"
              $flexDirection={["column", "row"]}
            >
              <Heading tag={"h2"} $color="hyperlink" $font={["heading-7"]}>
                <OakLink page="blog-index" category={blog.category.slug}>
                  {blog.category.title}
                </OakLink>
              </Heading>
              <Span $font={"body-3"} $mt={[8, 0]}>
                {formattedDate}
              </Span>
            </Flex>
            <Heading $mt={12} $font={["heading-5", "heading-4"]} tag={"h1"}>
              {blog.title}
            </Heading>
            <Flex
              $alignItems={"center"}
              $mt={16}
              $mr={[20, 0]}
              $justifyContent={["space-between", "left"]}
            >
              <Flex $alignItems={"center"}>
                {blog.author.image && (
                  <AvatarImage image={blog.author.image} $mr={12} />
                )}
                <Box $mr={[0, 40]}>
                  <Heading tag="h2" $font={"heading-7"}>
                    {blog.author.name}
                  </Heading>
                  {blog.author.role && (
                    <P $mt={4} $font={"body-3"} $color={"oakGrey4"}>
                      {blog.author.role}
                    </P>
                  )}
                </Box>
              </Flex>
              <CopyLinkButton />
            </Flex>
            <Box $mt={[48]}>
              <BlogPortableText portableText={props.blog.contentPortableText} />
            </Box>
          </GridArea>
        </Grid>
      </MaxWidth>
      <BlogJsonLd {...props.blog} />
    </Layout>
  );
};

type URLParams = { blogSlug: string };

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const blogResults = await CMSClient.blogPosts();

  const paths = blogResults.map((blog) => ({
    params: { blogSlug: blog.slug },
  }));

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<BlogPageProps, URLParams> = async (
  context
) => {
  const blogSlug = context.params?.blogSlug as string;
  const isPreviewMode = context.preview === true;

  const blogResult = await CMSClient.blogPostBySlug(blogSlug, {
    previewMode: isPreviewMode,
  });

  const blogResults = await CMSClient.blogPosts();
  const categories = uniqBy(
    "title",
    blogResults.map((blogResult) => blogResult.category)
  ).sort((a, b) => (a.title < b.title ? -1 : 1));

  if (!blogResult) {
    return {
      notFound: true,
    };
  }

  const blog = {
    ...blogResult,
    date: blogResult.date.toISOString(),
  };

  const results: GetStaticPropsResult<BlogPageProps> = {
    props: {
      categories,
      blog,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default BlogDetailPage;
