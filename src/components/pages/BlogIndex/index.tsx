import { uniqBy } from "lodash/fp";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTheme } from "styled-components";

import { BlogListJsonLd } from "../../../browser-lib/seo/getJsonLd";
import { getSeoProps } from "../../../browser-lib/seo/getSeoProps";
import { BlogProvider } from "../../../context/Blog";
import CMSClient, {
  BlogPostPreview,
  BlogWebinarCategory,
} from "../../../node-lib/cms";
import BlogCategoryList from "../../BlogCategoryList/BlogCategoryList";
import BlogList from "../../BlogList";
import { BlogListItemProps } from "../../BlogList/BlogListItem";
import SummaryCard from "../../Card/SummaryCard";
import Grid, { GridArea } from "../../Grid";
import Layout from "../../Layout";
import MaxWidth from "../../MaxWidth/MaxWidth";

export type SerializedBlogPostPreview = Omit<BlogPostPreview, "date"> & {
  date: string;
};

export type BlogListingPageProps = {
  blogs: SerializedBlogPostPreview[];
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
};

const BlogListingPage: NextPage<BlogListingPageProps> = (props) => {
  const { blogs, categories, categorySlug } = props;

  const cardImage = {
    src: "/images/illustrations/teacher-carrying-stuff-237-286.png",
    alt: "",
  };

  console.log({ categorySlug });

  const blogListItems = blogs.map(blogToBlogListItem);
  const theme = useTheme();
  const HEADER_HEIGHT = theme.header.height;

  return (
    <BlogProvider categories={categories}>
      <Layout
        seoProps={getSeoProps({
          title: "Latest Blogs & Insights",
          description:
            "Keep up to date with our latest blog posts, filled with insights, news and updates from Oak National Academy.",
        })}
        $background="white"
      >
        <MaxWidth $pt={[72, 80, 80]}>
          <SummaryCard
            title={"Blog Listing"}
            heading={"Inspiration for inside and outside the classroom"}
            // TODO: Replace line summary with new field from CMS
            summary={
              "Read blogs from our in-house experts to find ideas to take away and try, from curriculum planning to lesson delivery. Plus, keep up to date with the latest news and insights from Oak."
            }
            imageProps={cardImage}
          />
          <Grid $ph={[12, 0]}>
            <GridArea $order={[0, 0, 2]} $colSpan={[12, 12, 3]}>
              <BlogCategoryList
                $position={[null, null, "sticky"]}
                $top={[null, null, HEADER_HEIGHT]}
                $pt={[48, 72]}
                categories={categories}
                selectedCategorySlug={categorySlug}
              />
            </GridArea>
            {/* @todo is there a nicer way to make this 1 column spacer? */}
            <GridArea $order={1} $colSpan={[12, 12, 1]} />
            <GridArea $order={[1, 1, 0]} $colSpan={[12, 12, 8]} $mt={[48, 72]}>
              <BlogList
                title={"Stay up to date!"}
                items={blogListItems}
                titleTag={"h2"}
                withImage
              />
            </GridArea>
          </Grid>
        </MaxWidth>
        <BlogListJsonLd blogs={props.blogs} />
      </Layout>
    </BlogProvider>
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

export const getStaticProps: GetStaticProps<
  BlogListingPageProps,
  // @todo is below typesafe?
  { categorySlug?: string }
> = async (context) => {
  const isPreviewMode = context.preview === true;

  const blogResults = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
  });

  const blogCategories = uniqBy(
    "title",
    blogResults.map((blogResult) => blogResult.category)
  ).sort((a, b) => (a.title < b.title ? -1 : 1));

  const categorySlug = context.params?.categorySlug || null;

  const blogs = blogResults.map(serializeDate).filter((blog) => {
    if (categorySlug) {
      return blog.category.slug === categorySlug;
    }
    return true;
  });

  return {
    props: {
      blogs,
      categories: blogCategories,
      categorySlug,
    },
    revalidate: 10,
  };
};

type URLParams = { categorySlug: string };
export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const blogResults = await CMSClient.blogPosts();

  const paths = blogResults.map((blogResult) => ({
    params: {
      categorySlug: blogResult.category.slug,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default BlogListingPage;
