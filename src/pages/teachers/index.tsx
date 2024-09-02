import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import CMSClient from "@/node-lib/cms";
import getPageProps from "@/node-lib/getPageProps";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import TeachersTab from "@/components/GenericPagesComponents/TeachersTab";
import { HomePage } from "@/common-lib/cms-types";
import curriculumApi2023, {
  TeachersHomePageData,
} from "@/node-lib/curriculum-api-2023";
import { getAndMergeWebinarsAndBlogs } from "@/utils/getAndMergeWebinarsAndBlogs";
import {
  HomePageLowerView,
  SerializedPost,
} from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";

export type TeachersHomePageProps = HomePageProps & {
  curriculumData: TeachersHomePageData;
};

export type HomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
};

const Teachers: NextPage<TeachersHomePageProps> = (props) => {
  const { curriculumData, posts } = props;

  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"white"}>
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
      const isPreviewMode = context.preview === true;
      const curriculumData = await curriculumApi2023.teachersHomePage();

      const teachersHomepageData = await CMSClient.homepage({
        previewMode: isPreviewMode,
      });

      if (!teachersHomepageData) {
        return {
          notFound: true,
        };
      }

      const posts = await getAndMergeWebinarsAndBlogs(isPreviewMode, 5);

      const results: GetStaticPropsResult<TeachersHomePageProps> = {
        props: {
          pageData: teachersHomepageData,
          curriculumData,
          posts,
        },
      };
      return results;
    },
  });
};

export default Teachers;
