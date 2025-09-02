import { GetStaticProps, NextPage } from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import { HomePage } from "@/common-lib/cms-types";
import Banners from "@/components/SharedComponents/Banners";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import AiTab from "@/components/GenericPagesComponents/AiTab";
import {
  getPropsFunction,
  SerializedPost,
} from "@/pages-helpers/home/getBlogPosts";

export type AiHomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
};

const Ai: NextPage<AiHomePageProps> = (props) => {
  const testimonials = props.pageData?.testimonials;
  const intro = props.pageData?.intro;

  return (
    <AppLayout
      seoProps={{
        title: "Free, AI-powered lesson assistant | Oak National Academy",
        description:
          "Looking to create tailor-made lesson resources? Use our free AI-powered lesson assistant to make bespoke lesson plans, worksheets, quizzes and slides in minutes.",
      }}
      $background={"white"}
    >
      <Banners />
      <HomePageTabImageNav current={"ai"} />
      <AiTab aria-current="page" />
      <HomePageLowerView
        posts={props.posts}
        testimonials={testimonials}
        introVideo={intro}
      />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<AiHomePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "ai-home-page::getStaticProps",
    context,
    getProps: getPropsFunction(context),
  });
};

export default Ai;
