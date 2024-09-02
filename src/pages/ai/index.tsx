import { GetStaticProps, NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import { HomePage } from "@/common-lib/cms-types";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import AiTab from "@/components/GenericPagesComponents/AiTab";
import {
  getPropsFunction,
  SerializedPost,
} from "@/pages-helpers/homesite/getBlogPosts";

export type PupilHomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
};

const Ai: NextPage<PupilHomePageProps> = (props) => (
  <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"white"}>
    <HomePageTabImageNav current={"ai"} />
    <AiTab aria-current="page" />
    <HomePageLowerView posts={props.posts} />
  </AppLayout>
);

export const getStaticProps: GetStaticProps<PupilHomePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "curriculum-home-page::getStaticProps",
    context,
    getProps: getPropsFunction(context),
  });
};

export default Ai;
