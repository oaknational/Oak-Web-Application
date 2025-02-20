import React from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useNextSanityImage } from "next-sanity-image";
import { uniqBy } from "lodash/fp";
import { OakBox } from "@oaknational/oak-components";

import Layout from "@/components/AppComponents/Layout";
import CMSClient from "@/node-lib/cms";
import { BlogPost } from "@/common-lib/cms-types";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { BlogJsonLd } from "@/browser-lib/seo/getJsonLd";
import BlogPortableText from "@/components/GenericPagesComponents/PostPortableText/PostPortableText";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { sanityClientLike } from "@/components/HooksAndUtils/sanityImageBuilder";
import { getBlogWebinarPostBreadcrumbs } from "@/components/SharedComponents/Breadcrumbs/getBreadcrumbs";
import PostSingleLayout from "@/components/SharedComponents/PostSingleLayout";
import getPageProps from "@/node-lib/getPageProps";

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
    },
  );

  return (
    <Layout
      seoProps={getSeoProps({
        ...props.blog.seo,
        title: props.blog.seo?.title || props.blog.title,
        description:
          props.blog.seo?.description || props.blog.summaryPortableText,
        imageUrl: sharingImage.src,
      })}
      $background="white"
    >
      <PostSingleLayout
        content={props}
        breadcrumbs={getBlogWebinarPostBreadcrumbs(
          categories,
          blog,
          "blog",
          "Blog",
        )}
      >
        <OakBox $mt="space-between-l">
          <BlogPortableText portableText={props.blog.contentPortableText} />
        </OakBox>
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
  return getPageProps({
    page: "blog-single::getStaticProps",
    context,
    getProps: async () => {
      const blogSlug = context.params?.blogSlug as string;
      const isPreviewMode = context.preview === true;

      const blogResult = await CMSClient.blogPostBySlug(blogSlug, {
        previewMode: isPreviewMode,
      });

      const blogResults = await CMSClient.blogPosts();
      const categories = uniqBy(
        "title",
        blogResults.map((blogResult) => blogResult.category),
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
      return results;
    },
  });
};

export default BlogSinglePage;
