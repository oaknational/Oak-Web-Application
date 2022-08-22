import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  MissingComponentHandler,
  PortableText,
  PortableTextComponentsProvider,
} from "@portabletext/react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import CMSClient, {
  BlogPost,
  PortableTextJSON,
  SanityImage,
  TextAndMedia,
} from "../../node-lib/cms";
import CMSImage from "../../components/CMSImage";

type SerializedBlog = Omit<BlogPost, "date"> & {
  date: string;
};

export type BlogPageProps = {
  blog: SerializedBlog;
  isPreviewMode: boolean;
};

type PortableTextComponent<T = unknown> = {
  children?: React.ReactNode;
  value?: T;
};

// When we get the JSON portable text it doesn't have the same field names as
// our generic types / what comes from our graphql queries
type TextAndMediaBlock = Omit<TextAndMedia, "bodyPortableText"> & {
  body: PortableTextJSON;
};

const portableTextComponents = {
  block: {
    sectionHeading: (props: PortableTextComponent) => {
      // @TODO: Choose an appropriate section heading level
      return <h2>{props.children}</h2>;
    },
  },
  marks: {
    internalLink: (props: PortableTextComponent<{ reference: string }>) => {
      const { reference } = props.value || {};
      return (
        <>
          <a href="https://thenational.academy" style={{ color: "red" }}>
            {props.children}
          </a>
          <code>{JSON.stringify(JSON.stringify(reference), null, 2)}</code>
        </>
      );
    },
    link: (props: PortableTextComponent<{ href: string }>) => {
      const { href } = props.value || {};

      return (
        <a href={href} style={{ color: "blue" }}>
          {props.children}
        </a>
      );
    },
  },
  types: {
    textBlock: (
      props: PortableTextComponent<{ title: string; body: PortableTextJSON }>
    ) => {
      const { body, title, ...params } = props.value || {};
      return (
        <div style={{ border: "1px solid red" }}>
          TextBlock example
          <pre>{JSON.stringify(params, null, 2)}</pre>
          <h2>{title}</h2>
          <PortableText value={body} />
        </div>
      );
    },
    image: (props: PortableTextComponent<{ asset: SanityImage["asset"] }>) => {
      let asset = { url: "", _id: "" };
      const { ...params } = props.value;
      asset = props.value?.asset || asset;

      return (
        <div style={{ border: "1px solid red" }}>
          Image example
          <pre>{JSON.stringify(params, null, 2)}</pre>
          <CMSImage image={asset} />
        </div>
      );
    },
    textAndMedia: (props: PortableTextComponent<TextAndMediaBlock>) => {
      const { body, title, ...params } = props.value || {};

      return (
        <div style={{ border: "1px solid red" }}>
          Text and media example
          <pre>{JSON.stringify(params, null, 2)}</pre>
          {/* @TODO: Provide all these components using context so
                    we don't have to re-specify each time */}
          <h2>{title}</h2>
          <PortableText value={body} />
        </div>
      );
    },
    quote: (
      props: PortableTextComponent<{
        // @TODO: Reference shared quote type when it's added in another PR
        text: string;
        attribution: string;
        role: string;
      }>
    ) => {
      return (
        <div style={{ border: "1px solid red" }}>
          Quote example
          <pre>{JSON.stringify(props.value, null, 2)}</pre>
        </div>
      );
    },
  },
};

const logMissingPortableTextComponents: MissingComponentHandler = (
  message,
  options
) => {
  console.log(message, {
    type: options.type,
    nodeType: options.nodeType,
  });
};

const BlogDetailPage: NextPage<BlogPageProps> = (props) => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background="grey1"
      isPreviewMode={props.isPreviewMode}
    >
      <Heading tag="h1" $fontSize={24}>
        {props.blog.title}
      </Heading>
      {props.blog.date} <br />
      Hosted by: {props.blog.author.name}
      <PortableTextComponentsProvider components={portableTextComponents}>
        <PortableText
          value={props.blog.contentPortableText}
          onMissingComponent={logMissingPortableTextComponents}
        />
      </PortableTextComponentsProvider>
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

  const blog = {
    ...blogResult,
    date: blogResult.date.toISOString(),
  };

  return {
    props: {
      blog,
      isPreviewMode,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
};

export default BlogDetailPage;
