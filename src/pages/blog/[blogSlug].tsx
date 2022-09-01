import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  MissingComponentHandler,
  PortableText,
  PortableTextComponentsProvider,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Layout from "../../components/Layout";
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
import Box from "../../components/Box";
import Card from "../../components/Card";
import Cover from "../../components/Cover";
import { Heading, P, Span } from "../../components/Typography";
// import CopyLinkButton from "../../components/Button/CopyLinkButton";

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
        <Heading $fontSize={32} $lineHeight={"40px"} tag="h2" $mt={56} $mb={32}>
          {props.children}
        </Heading>
      );
    },
    normal: (props: PortableTextComponent) => {
      return (
        <P $lineHeight={"28px"} $fontSize={16} $mt={16}>
          {props.children}
        </P>
      );
    },
  },
  list: {
    bullet: (props: PortableTextComponent) => <ul>{props.children}</ul>,
    number: (props: PortableTextComponent) => <ol>{props.children}</ol>,
  },
  listItem: {
    bullet: (props: PortableTextComponent) => <li>{props.children}</li>,
    number: (props: PortableTextComponent) => <li>{props.children}</li>,
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
        <Box $width={"100%"} $mt={80} $mb={[64]}>
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
        <Box>
          {video && (
            <Flex $position={"relative"} $mt={56}>
              <VideoPlayer title={title} playbackId={video.asset.playbackId} />
            </Flex>
          )}
        </Box>
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
        <Flex $flexDirection={flexDirection} $alignItems={"center"} $mt={56}>
          <div>
            <Heading $fontSize={32} $lineHeight={"40px"} tag="h2">
              {params.title}
            </Heading>
            <Box $mt={32}>
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
        <Flex $flexDirection={"column"} $mt={56}>
          <P $fontSize={32} $lineHeight={"40px"} $fontFamily={"headingLight"}>
            <blockquote>&ldquo;{props.value?.text}&rdquo;</blockquote>
          </P>
          <P $fontSize={16} $lineHeight={"20px"} $mt={16}>
            <cite>{props.value?.attribution}</cite>, {props.value?.role}
          </P>
        </Flex>
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
    src: "/images/illustrations/teacher-carrying-stuff.png",
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
      <MaxWidth $ph={[12, 12, 0]} $pt={56}>
        <Card
          $pa={0}
          $background={"teachersPastelYellow"}
          $flexDirection={"row"}
          $justifyContent={"space-between"}
          $width="100%"
          $pv={[24]}
          $ph={[16, 24]}
        >
          <Flex
            $justifyContent={"center"}
            $flexDirection={"column"}
            $maxWidth={812}
            $mr={48}
          >
            <Heading
              $mb={8}
              tag={"h2"}
              $fontSize={[20, 24]}
              $color={"oakGrey4"}
              $fontFamily="heading"
            >
              Blog page
            </Heading>
            <Heading
              $mb={16}
              $color={"black"}
              $fontSize={[24, 32, 32]}
              tag={"h1"}
            >
              {blog.title}
            </Heading>
            <P $color="black" $fontSize={18}>
              {blog.summary}
            </P>
          </Flex>
          <Flex
            $display={["none", "flex"]}
            $position="relative"
            $minWidth={"30%"}
            $justifyContent={["center", "flex-end"]}
            $alignItems={["flex-end"]}
            $pr={[0, 24]}
            $pb={24}
          >
            <Cover>
              <Image
                aria-hidden={true}
                layout="fill"
                objectFit="contain"
                objectPosition={"right"}
                alt={cardImage.alt}
                src={cardImage.src}
                priority
              />
            </Cover>
          </Flex>
        </Card>

        <Grid $mt={[48, 64]}>
          <GridArea $colSpan={[12, 7]}>
            <P $fontSize={14} $lineHeight={"20px"} $mt={16}>
              {formattedDate}
            </P>
            <Flex $alignItems={"center"} $mt={16}>
              <Heading tag="h2" $fontSize={16} $lineHeight={"20px"} $mr={40}>
                {blog.author.name}
              </Heading>
              {/* TODO: add more UI for copy link button */}
              {/* <CopyLinkButton /> */}
            </Flex>
            <Box $mt={[96, 64]}>
              <PortableTextComponentsProvider
                components={portableTextComponents}
              >
                <PortableText
                  value={props.blog.contentPortableText}
                  onMissingComponent={logMissingPortableTextComponents}
                />
              </PortableTextComponentsProvider>
            </Box>
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
