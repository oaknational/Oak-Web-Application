import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import TeachersTab from "@/components/GenericPagesComponents/TeachersTab";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023, {
  TeachersHomePageData,
} from "@/node-lib/curriculum-api-2023";
import {
  getBlogPosts,
  SerializedPost,
} from "@/pages-helpers/home/getBlogPosts";
import { HomePage } from "@/common-lib/cms-types";

export type TeachersHomePageProps = HomePageProps & {
  curriculumData: TeachersHomePageData;
};

export type HomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
};

const Home: NextPage<TeachersHomePageProps> = (props) => {
  const { curriculumData, posts } = props;

  return (
    <AppLayout
      seoProps={{
        title: "Free, time-saving teacher resources | Oak National Academy",
        description:
          "Explore our free, time-saving teacher resources from Oak National Academy. Browse and download worksheets, quizzes and slides from KS1 to KS4. ",
      }}
      $background={"white"}
    >
      <HomePageTabImageNav current={"teachers"} />
      <TeachersTab keyStages={curriculumData.keyStages} aria-current="page" />
      <HomePageLowerView posts={posts} />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "teachers-home-page::getStaticProps",
    context,
    getProps: async () => {
      const { pageData, posts } = await getBlogPosts(
        context.preview === true,
        5,
      );

      if (!pageData) {
        return {
          notFound: true,
        };
      }

      const curriculumData = await curriculumApi2023.teachersHomePage();

      const results: GetStaticPropsResult<TeachersHomePageProps> = {
        props: {
          pageData,
          curriculumData,
          posts,
        },
      };
      return results;
    },
  });
};

export default Home;