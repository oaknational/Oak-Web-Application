import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import TeachersTab from "@/components/GenericPagesComponents/TeachersTab";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import Banners from "@/components/SharedComponents/Banners";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023, {
  KeyStagesData,
} from "@/node-lib/curriculum-api-2023";
import {
  getBlogPosts,
  SerializedPost,
} from "@/pages-helpers/home/getBlogPosts";
import { HomePage } from "@/common-lib/cms-types";
import CMSClient from "@/node-lib/cms";
import {
  CampaignPage,
  NewsletterSignUp,
} from "@/common-lib/cms-types/campaignPage";

export type TeachersHomePageProps = HomePageProps & {
  curriculumData: KeyStagesData;
};

export type HomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
  campaignData: CampaignPage;
};

const TeachersHomePage: NextPage<TeachersHomePageProps> = (props) => {
  const { curriculumData, posts, pageData, campaignData } = props;

  const testimonials = pageData?.testimonials;
  const intro = pageData?.intro;
  const campaignPromoBanner = pageData.campaignPromoBanner;

  console.log(campaignData);
  const newsletterSignUp = campaignData.content.find(
    ({ type }) => type === "NewsletterSignUp",
  ) as NewsletterSignUp;

  return (
    <AppLayout
      seoProps={{
        title: "Free, time-saving teacher resources | Oak National Academy",
        description:
          "Explore our free, time-saving teacher resources from Oak National Academy. Browse and download worksheets, quizzes and slides from KS1 to KS4. ",
      }}
      $background={"white"}
    >
      <Banners />
      <HomePageTabImageNav current={"teachers"} />
      <TeachersTab keyStages={curriculumData.keyStages} aria-current="page" />
      <HomePageLowerView
        newsletterSignUp={newsletterSignUp}
        campaignPromoBanner={campaignPromoBanner}
        posts={posts}
        testimonials={testimonials}
        introVideo={intro}
      />
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

      const campaignData = await CMSClient.campaignPageBySlug("mythbusting");

      console.log(campaignData);
      if (!pageData || !campaignData) {
        return {
          notFound: true,
        };
      }

      const curriculumData = await curriculumApi2023.keyStages();

      const results: GetStaticPropsResult<TeachersHomePageProps> = {
        props: {
          pageData,
          curriculumData,
          posts,
          campaignData,
        },
      };
      return results;
    },
  });
};

export default TeachersHomePage;
