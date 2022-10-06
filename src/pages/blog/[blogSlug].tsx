import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  MissingComponentHandler,
  PortableText,
  PortableTextComponents,
  PortableTextComponentProps,
} from "@portabletext/react";
import { useNextSanityImage } from "next-sanity-image";
import { useTheme } from "styled-components";
import { uniqBy } from "lodash/fp";

import config from "../../config";
import Layout from "../../components/Layout";
import CMSClient, {
  BlogPost,
  CTA,
  PortableTextJSON,
  Quote,
  Image,
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
import MobileBlogFilters from "../../components/MobileBlogFilters";
import OakLink from "../../components/OakLink";
import BlogCategoryList from "../../components/BlogCategoryList";
import Circle from "../../components/Circle";
import useBlogCategoryList from "../../components/BlogCategoryList/useBlogCategoryList";

export type SerializedBlog = Omit<BlogPost, "date"> & {
  date: string;
};

export type BlogPageProps = {
  blog: SerializedBlog;
  categories: { title: string; slug: string }[];
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
          $font={["heading-6", "heading-4"]}
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
          <P $font={"heading-light-4"}>
            <blockquote>{props.children}</blockquote>
          </P>
        </Flex>
      );
    },
  },
  types: {
    imageWithAltText: (
      props: PortableTextComponentProps<{ asset: Image["asset"] }>
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
            <Heading $font={["heading-5", "heading-4"]} tag="h2">
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
          <P $font={["heading-light-5", "heading-light-4"]}>
            <blockquote>&ldquo;{props.value.text}&rdquo;</blockquote>
          </P>
          <div>
            <P $font={"body-1"} $mt={[16]} $textAlign="center">
              <cite>{props.value?.attribution}</cite>
              {props.value.role && `, ${props.value.role}`}
            </P>
          </div>
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
                  return <P $font={"heading-light-5"}>{props.children}</P>;
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

  return {
    props: {
      categories,
      blog,
      isPreviewMode,
    },
    revalidate: config.get("sanityRevalidateSeconds"),
  };
};

export default BlogDetailPage;
