import { GetStaticProps, NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import BlogList from "../../components/BlogList";
import { BlogListItemProps } from "../../components/BlogList/BlogListItem";
import Layout from "../../components/Layout";
import CMSClient from "../../node-lib/cms";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Grid, { GridArea } from "../../components/Grid";
import SummaryCard from "../../components/Card/SummaryCard";

import { SerializedBlog } from "./[blogSlug]";

export type BlogListingPageProps = {
  blogs: SerializedBlog[];
  isPreviewMode: boolean;
};

const BlogListingPage: NextPage<BlogListingPageProps> = (props) => {
  const blogs = props.blogs.map(blogToBlogListItem);

  const cardImage = {
    src: "/images/illustrations/teacher-carrying-stuff.png",
    alt: "",
  };

  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background="white"
      isPreviewMode={props.isPreviewMode}
    >
      <MaxWidth $ph={[12, 12, 0]} $pt={[72, 80, 80]}>
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
        <Grid>
          <GridArea $colSpan={[12, 12, 7]} $mt={[48, 72]}>
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

const blogToBlogListItem = (blog: SerializedBlog): BlogListItemProps => ({
  contentType: "blog-post",
  title: blog.title,
  href: `/blog/${blog.slug}`,
  snippet: blog.summary,
  titleTag: "h3",
  category: blog.category.title,
  date: blog.date,
  mainImage: blog?.mainImage?.asset?.url || "",
});

export const getStaticProps: GetStaticProps<BlogListingPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const blogResults = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
  });

  const blogs = blogResults.map((blog) => {
    return {
      ...blog,
      date: blog.date.toISOString(),
    };
  });

  return {
    props: {
      blogs,
      isPreviewMode,
    },
    revalidate: 10,
  };
};

export default BlogListingPage;
