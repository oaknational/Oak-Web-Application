import { GetStaticProps, NextPage } from "next";

import { isCycleTwoEnabled } from "@/utils/curriculum/features";
import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import { HomePage } from "@/common-lib/cms-types";
import HomePageBanner from "@/components/CurriculumComponents/Banner";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import AiTab from "@/components/GenericPagesComponents/AiTab";
import {
  getPropsFunction,
  SerializedPost,
} from "@/pages-helpers/home/getBlogPosts";

export type PupilHomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
};

const cycleTwoEnabled = isCycleTwoEnabled();

const Ai: NextPage<PupilHomePageProps> = (props) => (
  <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"white"}>
    {cycleTwoEnabled ? (
      <HomePageBanner
        background="lemon"
        newText="Subjects added"
        ctaText="See curriculum plans"
        page="curriculum-landing-page"
      />
    ) : null}
    <HomePageTabImageNav current={"ai"} />
    <AiTab aria-current="page" />
    <HomePageLowerView posts={props.posts} />
  </AppLayout>
);

export const getStaticProps: GetStaticProps<PupilHomePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "ai-home-page::getStaticProps",
    context,
    getProps: getPropsFunction(context),
  });
};

export default Ai;
