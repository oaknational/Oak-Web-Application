import React from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useNextSanityImage } from "next-sanity-image";
import { uniqBy } from "lodash/fp";

import Layout from "../../components/Layout";
import CMSClient from "../../node-lib/cms";
import { BlogPost } from "../../common-lib/cms-types";
import { decorateWithIsr } from "../../node-lib/isr";
import Box from "../../components/Box";
import { BlogJsonLd } from "../../browser-lib/seo/getJsonLd";
import BlogPortableText from "../../components/Blog/BlogPortableText/BlogPortableText";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import { sanityClientLike } from "../../components/CMSImage";
import { getBlogWebinarPostBreadcrumbs } from "../../components/Breadcrumbs/getBreadcrumbs";
import BlogWebinarsIndexLayout from "../../components/Blog/BlogWebinarsIndexLayout";

export type SerializedBlog = Omit<BlogPost, "date"> & {
  date: string;
};

export type BlogPageProps = {
  blog: SerializedBlog;
  categories: { title: string; slug: string }[];
};

const BlogDetailPage: NextPage<BlogPageProps> = (props) => {
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
      <BlogWebinarsIndexLayout content={props}>
        <Box $mt={[48]}>
          <BlogPortableText portableText={props.blog.contentPortableText} />
        </Box>
      </BlogWebinarsIndexLayout>
      <BlogJsonLd blog={props.blog} />
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
