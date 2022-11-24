import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import AppLayout from "../../components/AppLayout";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import { Heading } from "../../components/Typography";
import { HomePageProps, postToBlogListItem, sortByDate } from "..";
import CMSClient from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";
import { serializeDate } from "../../utils/serializeDate";
import Flex from "../../components/Flex";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import {
  HomeSiteCards,
  SharedHomeContent,
} from "../../components/SharedHomeContent";
import useBlogList from "../../components/Blog/BlogList/useBlogList";

const Teachers: NextPage<HomePageProps> = (props) => {
  const posts = props.posts.map(postToBlogListItem);
  const blogListProps = useBlogList({ items: posts, withImage: true });

  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
        <MaxWidth>
          <Heading
            $font={["heading-5", "heading-4"]}
            tag={"h1"}
            $mb={24}
            $mt={120}
            $color={"black"}
          >
            Teachers Homepage
          </Heading>
          <HomeSiteCards />
        </MaxWidth>
      </Flex>
      <SharedHomeContent
        blogListProps={blogListProps}
        pageData={props.pageData}
      />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const homepageData = await CMSClient.homepage({
    previewMode: isPreviewMode,
  });

  if (!homepageData) {
    return {
      notFound: true,
    };
  }

  const blogResults = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
    limit: 5,
  });

  const blogPosts = blogResults.map((blog) => ({
    ...blog,
    type: "blog-post" as const,
  }));

  const webinarResults = await CMSClient.webinars({
    previewMode: isPreviewMode,
    limit: 5,
  });
  const webinars = webinarResults
    .map((webinar) => ({
      ...webinar,
      type: "webinar" as const,
    }))
    .filter((webinar) => webinar.date.getTime() < new Date().getTime());

  const posts = [...blogPosts, ...webinars]
    .sort(sortByDate)
    .slice(0, 4)
    .map(serializeDate);

  const results: GetStaticPropsResult<HomePageProps> = {
    props: {
      pageData: homepageData,
      posts,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default Teachers;
