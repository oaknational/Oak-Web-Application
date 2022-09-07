import { GetStaticProps, NextPage } from "next";

import BlogList from "../../components/BlogList";
import { BlogListItemProps } from "../../components/BlogList/BlogListItem";
import Layout from "../../components/Layout";
import CMSClient, { BlogPostPreview } from "../../node-lib/cms";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Grid, { GridArea } from "../../components/Grid";
import SummaryCard from "../../components/Card/SummaryCard";
import { BlogListJsonLd } from "../../browser-lib/seo/getJsonLd";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";

export type SerializedBlogPostPreview = Omit<BlogPostPreview, "date"> & {
  date: string;
};

export type BlogListingPageProps = {
  blogs: SerializedBlogPostPreview[];
  isPreviewMode: boolean;
};

const BlogListingPage: NextPage<BlogListingPageProps> = (props) => {
  const blogs = props.blogs.map(blogToBlogListItem);

  const cardImage = {
    src: "/images/illustrations/teacher-carrying-stuff-237-286.png",
    alt: "",
  };

  return (
    <Layout
      seoProps={getSeoProps({
        title: "Latest Blogs & Insights",
        description:
          "Keep up to date with our latest blog posts, filled with insights, news and updates from Oak National Academy.",
      })}
      $background="white"
      isPreviewMode={props.isPreviewMode}
    >
      <MaxWidth $pt={[72, 80, 80]}>
        <SummaryCard
          title={"Blog Listing"}
          heading={"Inspiration for inside and outside the classroom"}
          // TODO: Replace line summary with new field from CMS
          summary={
            "Read blogs from our in-house experts to find ideas to take away and try, from curriculum planning to lesson delivery. Plus, keep up to date with the latest news and insights from Oak."
          }
          background="teachersPastelYellow"
          imageProps={cardImage}
        />
        <Grid $ph={[12, 0]}>
          <GridArea $colSpan={[12, 12, 8]} $mt={[48, 72]}>
            <BlogList
              title={"Stay up to date!"}
              items={blogs}
              titleTag={"h2"}
              withImage
            />
          </GridArea>
        </Grid>
      </MaxWidth>
      <BlogListJsonLd blogs={props.blogs} />
    </Layout>
  );
};

export const blogToBlogListItem = (
  blog: SerializedBlogPostPreview
): BlogListItemProps => ({
  contentType: "blog-post",
  title: blog.title,
  href: `/blog/${blog.slug}`,
  snippet: blog.summary,
  titleTag: "h3",
  category: blog.category,
  date: blog.date,
  mainImage: blog?.mainImage,
});

export const serializeDate = <T extends { date: Date }>(
  item: T
): T & { date: string } => ({
  ...item,
  date: item.date.toISOString(),
});

export const getStaticProps: GetStaticProps<BlogListingPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const blogResults = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
  });

  const blogs = blogResults.map(serializeDate);

  return {
    props: {
      blogs,
      isPreviewMode,
    },
    revalidate: 10,
  };
};

export default BlogListingPage;
