import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  MissingComponentHandler,
  PortableText,
  PortableTextComponentsProvider,
} from "@portabletext/react";
import Link from "next/link";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Layout from "../../components/Layout";
import { Heading, P, Span } from "../../components/Typography";
import CMSClient, {
  BlogPost,
  PortableTextJSON,
  SanityImage,
  TextAndMedia,
  Video,
} from "../../node-lib/cms";
import CMSImage from "../../components/CMSImage";
import VideoPlayer from "../../components/VideoPlayer";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import SummaryCard from "../../components/Card/SummaryCard";
import Box from "../../components/Box";

export type SerializedBlog = Omit<BlogPost, "date"> & {
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

// There seems to be a TS bug where calling Omit discriminated union
// will "flatten" the type into a regular union
// workaround copied from here:
// https://github.com/microsoft/TypeScript/issues/31501
type OmitKeepDiscriminated<Type, K> = {
  [Property in keyof Type as Exclude<Property, K>]: Type[Property];
};

// When we get the JSON portable text it doesn't have the same field names as
// our generic types / what comes from our graphql queries
type TextAndMediaBlock = OmitKeepDiscriminated<
  TextAndMedia,
  "bodyPortableText"
> & {
  body: PortableTextJSON;
};

const portableTextComponents = {
  block: {
    sectionHeading: (props: PortableTextComponent) => {
      // @TODO: Choose an appropriate section heading level
      return (
        <Heading $fontSize={32} $lineHeight={"40px"} tag="h2">
          {props.children}
        </Heading>
      );
    },
  },
  marks: {
    internalLink: (props: PortableTextComponent<{ reference: string }>) => {
      const { reference } = props.value || {};
      return (
        <>
          {/* TODO: wait for Ross's PR to resolve link */}
          <a href="https://thenational.academy/404" style={{ color: "red" }}>
            {props.children}
          </a>
          <code>{JSON.stringify(JSON.stringify(reference), null, 2)}</code>
        </>
      );
    },
    link: (props: PortableTextComponent<{ href: string }>) => {
      if (!props.value?.href) {
        return null;
      }

      const { href } = props.value;

      return (
        <Span $color={"hyperlink"}>
          <Link href={href}>
            <a>{props.children}</a>
          </Link>
        </Span>
      );
    },
  },
  types: {
    image: (props: PortableTextComponent<{ asset: SanityImage["asset"] }>) => {
      if (!props.value) {
        return null;
      }

      return (
        <Box $position={"relative"} $width={"100%"} $mt={80}>
          <CMSImage image={props.value} />
        </Box>
      );
    },
    video: (props: PortableTextComponent<Video>) => {
      if (!props.value) {
        return null;
      }

      const { video, title } = props.value;

      return (
        <>
          {video && (
            <Flex $position={"relative"} $mt={80}>
              <VideoPlayer title={title} playbackId={video.asset.playbackId} />
            </Flex>
          )}
        </>
      );
    },
    textAndMedia: (props: PortableTextComponent<TextAndMediaBlock>) => {
      if (!props.value) {
        return null;
      }

      const params = props.value;

      // @TODO: Responsive handling - likely don't want it reversed
      const flexDirection =
        params.alignMedia === "left" ? "row-reverse" : "row";

      return (
        <Flex $flexDirection={flexDirection} $alignItems={"center"}>
          <div>
            <Heading $fontSize={32} $lineHeight={"40px"} tag="h2">
              {params.title}
            </Heading>
            <Box $pt={16}>
              <PortableText value={params.body} />
            </Box>
          </div>
          {params.mediaType === "image" && params.image && (
            <Box $mr={24}>
              <CMSImage image={params.image} />
            </Box>
          )}
          {params.mediaType === "video" && params.video && (
            <Box $mr={24}>
              <VideoPlayer
                title={params.video.title}
                playbackId={params.video.video.asset.playbackId}
              />
            </Box>
          )}
        </Flex>
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
  const { blog } = props;

  const cardImage = {
    imageSrc: "/images/illustrations/teacher-carrying-stuff.png",
    alt: "",
  };

  const formattedDate = new Date(blog.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background="grey1"
      isPreviewMode={props.isPreviewMode}
    >
      <MaxWidth $ph={[12, 12, 0]} $pt={[72, 80, 80]}>
        <SummaryCard
          title={"Blog Listing"}
          heading={"Inspiration for inside and outside the classroom"}
          summary={
            "Read blogs from our in-house experts to find ideas to take away and try, from curriculum planning to lesson delivery. Plus, keep up to date with the latest news and insights from Oak."
          }
          background="teachersPastelYellow"
          cardImageProps={cardImage}
        />
        <Grid $mt={[48, 64]}>
          <GridArea $colSpan={[12, 7]}>
            <P $fontSize={16} $lineHeight={"20px"}>
              {blog.category.title}
            </P>
            <P $fontSize={14} $lineHeight={"20px"} $mt={16}>
              {formattedDate}
            </P>
            <Heading tag="h1" $fontSize={32} $lineHeight={"48px"} $mt={16}>
              {props.blog.title}
            </Heading>
            <Heading tag="h2" $mt={16} $fontSize={16} $lineHeight={"20px"}>
              {blog.author.name}
            </Heading>
            <PortableTextComponentsProvider components={portableTextComponents}>
              <PortableText
                value={props.blog.contentPortableText}
                onMissingComponent={logMissingPortableTextComponents}
              />
            </PortableTextComponentsProvider>
          </GridArea>
        </Grid>
      </MaxWidth>
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
