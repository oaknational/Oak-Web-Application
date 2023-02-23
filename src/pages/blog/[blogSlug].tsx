import React from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useNextSanityImage } from "next-sanity-image";
import { uniqBy } from "lodash/fp";

import Layout from "../../components/Layout";
import CMSClient from "../../node-lib/cms";
import { BlogPost } from "../../common-lib/cms-types";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../node-lib/isr";
import Box from "../../components/Box";
import { BlogJsonLd } from "../../browser-lib/seo/getJsonLd";
import BlogPortableText from "../../components/Posts/PostPortableText/PostPortableText";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import { sanityClientLike } from "../../components/CMSImage";
import { getBlogWebinarPostBreadcrumbs } from "../../components/Breadcrumbs/getBreadcrumbs";
import PostSingleLayout from "../../components/Posts/PostSingleLayout";

export type SerializedBlog = Omit<BlogPost, "date"> & {
  date: string;
};

export type BlogSinglePageProps = {
  blog: SerializedBlog;
  categories: { title: string; slug: string }[];
};

const BlogSinglePage: NextPage<BlogSinglePageProps> = (props) => {
  const { blog, categories } = props;

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

  return (
    <Layout
      seoProps={getSeoProps({
        ...props.blog.seo,
        title: props.blog.seo?.title || props.blog.title,
        description: props.blog.seo?.description || props.blog.summary,
        imageUrl: sharingImage.src,
      })}
      $background="white"
      breadcrumbs={getBlogWebinarPostBreadcrumbs(
        categories,
        blog,
        "blog",
        "Blog"
      )}
    >
      <PostSingleLayout content={props}>
        <Box $mt={[48]}>
          <BlogPortableText portableText={props.blog.contentPortableText} />
        </Box>
      </PostSingleLayout>
      <BlogJsonLd blog={props.blog} />
    </Layout>
  );
};

type URLParams = { blogSlug: string };

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const blogResults = await CMSClient.blogPosts();

  const paths = blogResults.map((blog) => ({
    params: { blogSlug: blog.slug },
  }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  BlogSinglePageProps,
  URLParams
> = async (context) => {
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

  const results: GetStaticPropsResult<BlogSinglePageProps> = {
    props: {
      categories,
      blog,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default BlogSinglePage;
