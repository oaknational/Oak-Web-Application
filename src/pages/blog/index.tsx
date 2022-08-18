import { GetStaticProps, NextPage } from "next";
import { toPlainText } from "@portabletext/react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import BlogList from "../../components/BlogList";
import { BlogListItemProps } from "../../components/BlogList/BlogListItem";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import CMSClient, { BlogPostPreview } from "../../node-lib/cms";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Grid, { GridArea } from "../../components/Grid";

export type BlogListingPageProps = {
  blogs: BlogPostPreview[];
  isPreviewMode: boolean;
};

const BlogListingPage: NextPage<BlogListingPageProps> = (props) => {
  const blogs = props.blogs.map(blogToBlogListItem);

  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background="white"
      isPreviewMode={props.isPreviewMode}
    >
      <MaxWidth>
        <Grid>
          <GridArea $colSpan={[12, 12, 7]}>
            <Heading tag="h1" $fontSize={32}>
              Blog
            </Heading>

            <BlogList
              title={"Stay up to date!"}
              items={blogs}
              titleTag={"h2"}
            />
          </GridArea>
        </Grid>
      </MaxWidth>
    </Layout>
  );
};

const blogToBlogListItem = (blog: BlogPostPreview): BlogListItemProps => ({
  contentType: "blog-post",
  title: blog.title,
  href: `/blog/${blog.slug}`,
  snippet: toPlainText(blog.contentPortableText),
  titleTag: "h3",
});

export const getStaticProps: GetStaticProps<BlogListingPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const blogResults = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
  });

  return {
    props: {
      blogs: blogResults,
      isPreviewMode,
    },
    revalidate: 10,
  };
};

export default BlogListingPage;
