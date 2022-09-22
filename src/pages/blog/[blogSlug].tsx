import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  MissingComponentHandler,
  PortableText,
  PortableTextComponents,
  PortableTextComponentProps,
} from "@portabletext/react";
import { useNextSanityImage } from "next-sanity-image";

import Layout from "../../components/Layout";
import CMSClient, {
  BlogPost,
  CTA,
  PortableTextJSON,
  Quote,
  SanityImage,
  TextAndMedia,
  Video,
} from "../../node-lib/cms";
import CMSImage, { sanityClientLike } from "../../components/CMSImage";
import VideoPlayer from "../../components/VideoPlayer";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Box from "../../components/Box";
import { Heading, P, Span } from "../../components/Typography";
import CopyLinkButton from "../../components/Button/CopyLinkButton";
import { getCTAHref } from "../../utils/portableText/resolveInternalHref";
import { OmitKeepDiscriminated } from "../../utils/generics";
import ButtonAsLink from "../../components/Button/ButtonAsLink";
import { BasePortableTextProvider } from "../../components/PortableText";
import { BlogJsonLd } from "../../browser-lib/seo/getJsonLd";
import CMSVideo from "../../components/CMSVideo";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import Circle from "../../components/Circle";

export type SerializedBlog = Omit<BlogPost, "date"> & {
  date: string;
};

export type BlogPageProps = {
  blog: SerializedBlog;
};

// When we get the JSON portable text it doesn't have the same field names as
// our generic types / what comes from our graphql queries
type TextAndMediaBlock = OmitKeepDiscriminated<
  TextAndMedia,
  "bodyPortableText"
> & {
  body: PortableTextJSON;
};

const blogPortableTextComponents: PortableTextComponents = {
  block: {
    sectionHeading: (props) => {
      // @TODO: Choose an appropriate section heading level
      return (
        <Heading
          $fontSize={[20, 32]}
          $lineHeight={["24px", "40px"]}
          tag="h2"
          $mt={[48, 56]}
          $mb={[24, 32]}
        >
          {props.children}
        </Heading>
      );
    },
    callout: (props) => {
      return (
        <Flex $flexDirection={"column"} $mt={56}>
          <P $fontSize={32} $lineHeight={"40px"} $fontFamily={"headingLight"}>
            <blockquote>{props.children}</blockquote>
          </P>
        </Flex>
      );
    },
  },
  types: {
    imageWithAltText: (
      props: PortableTextComponentProps<{ asset: SanityImage["asset"] }>
    ) => {
      if (!props.value) {
        return null;
      }

      return <CMSImage image={props.value} $mt={80} $mb={64} />;
    },
    video: (props: PortableTextComponentProps<Video>) => {
      if (!props.value) {
        return null;
      }

      return (
        <Box>
          {props.value && (
            <Flex $position={"relative"} $mt={56}>
              <CMSVideo video={props.value} />
            </Flex>
          )}
        </Box>
      );
    },
    textAndMedia: (props: PortableTextComponentProps<TextAndMediaBlock>) => {
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
            <Heading $fontSize={[24, 32]} $lineHeight={"40px"} tag="h2">
              {params.title}
            </Heading>
            <Box $mt={32}>
              <PortableText value={params.body} />
            </Box>
            {params.cta && (
              <ButtonAsLink
                $mt={24}
                label={params.cta.label}
                href={getCTAHref(params.cta)}
                background={"teachersHighlight"}
              />
            )}
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
    quote: (props: PortableTextComponentProps<Quote>) => {
      if (!props.value?.text) {
        return null;
      }

      return (
        <Flex $flexDirection={"column"} $mt={56}>
          <P
            $fontSize={[24, 32]}
            $lineHeight={["32px", "40px"]}
            $fontFamily={"headingLight"}
          >
            <blockquote>&ldquo;{props.value.text}&rdquo;</blockquote>
          </P>
          <P $fontSize={[16]} $lineHeight={1.5} $mt={[16]} $textAlign="center">
            <cite>{props.value?.attribution}</cite>
            {props.value.role && `, ${props.value.role}`}
          </P>
        </Flex>
      );
    },
    callout: (
      props: PortableTextComponentProps<{ body: PortableTextJSON }>
    ) => {
      if (!props.value?.body) {
        return null;
      }

      return (
        <Flex
          $flexDirection={"column"}
          $mt={56}
          $pv={24}
          $ph={16}
          $background="teachersPastelYellow"
        >
          <PortableText
            value={props.value.body}
            components={{
              block: {
                sectionHeading: (props) => {
                  return <P $fontSize={24}>{props.children}</P>;
                },
              },
            }}
          />
        </Flex>
      );
    },
    cta: (props: PortableTextComponentProps<CTA>) => {
      if (!props.value) {
        return null;
      }
      const cta = props.value;

      return (
        <ButtonAsLink
          label={cta.label}
          href={getCTAHref(cta)}
          background={"teachersHighlight"}
        />
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

  return (
    <Layout
      seoProps={getSeoProps({
        ...props.blog.seo,
        title: props.blog.seo?.title || props.blog.title,
        description: props.blog.seo?.description || props.blog.summary,
        imageUrl: sharingImage.src,
      })}
      $background="white"
    >
      <MaxWidth>
        <Grid $ph={[12, 0]}>
          <GridArea $colSpan={[12, 7]}>
            <Flex
              $mt={[40, 80]}
              $justifyContent="space-between"
              $flexDirection={["column", "row"]}
            >
              <Heading
                tag={"h2"}
                $fontSize={[16]}
                $color="black" // change to "hyperlink" when it becomes a link
                $fontFamily="heading"
              >
                {blog.category.title}
              </Heading>
              <Span $fontFamily={"body"} $fontSize={[14]} $mt={[8, 0]}>
                {formattedDate}
              </Span>
            </Flex>
            <Heading $mt={12} $color={"black"} $fontSize={[24, 32]} tag={"h1"}>
              {blog.title}
            </Heading>
            <Flex $alignItems={"center"} $mt={16}>
              {blog.author.image && (
                <Circle $mr={12} $overflow={"hidden"} size={56}>
                  <CMSImage
                    image={{
                      altText: blog.author.image.altText,
                      isPresentational: blog.author.image.isPresentational,
                      asset: blog.author.image.asset,
                    }}
                  />
                </Circle>
              )}
              <Box $mr={48}>
                <Heading tag="h2" $fontSize={16} $lineHeight={"20px"} $mr={40}>
                  {blog.author.name}
                </Heading>
                {blog.author.role && (
                  <P $mt={4} fontSize={14} $color={"oakGrey4"}>
                    {blog.author.role}
                  </P>
                )}
              </Box>
              <CopyLinkButton />
            </Flex>
            <Box $mt={[48]}>
              <BasePortableTextProvider>
                <PortableText
                  components={blogPortableTextComponents}
                  value={props.blog.contentPortableText}
                  onMissingComponent={logMissingPortableTextComponents}
                />
              </BasePortableTextProvider>
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

  if (!blogResult) {
    return {
      notFound: true,
    };
  }

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
