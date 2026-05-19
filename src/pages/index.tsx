import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import {
  HomePageProps as BlogPostProps,
  getBlogPosts,
  SerializedPost,
} from "@/pages-helpers/home/getBlogPosts";
import AppLayout from "@/components/SharedComponents/AppLayout";
import TeachersTab from "@/components/GenericPagesComponents/TeachersTab";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import Banners from "@/components/SharedComponents/Banners";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { HomePage as CmsHomePage } from "@/common-lib/cms-types";
import getPageProps from "@/node-lib/getPageProps";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";

export type HomePageProps = BlogPostProps & {
  curriculumPhaseOptions: SubjectPhasePickerData;
  pageData: CmsHomePage;
  posts: SerializedPost[];
  topNav: TopNavProps;
};

const HomePage: NextPage<HomePageProps> = (props) => {
  const router = useRouter();
  useEffect(() => {
    // clientside redirect for old tabs implementation
    if (window.location.href.includes("#pupils")) {
      router.push("/pupils");
    } else if (window.location.href.includes("#curriculum")) {
      router.push("/curriculum");
    } else if (window.location.href.includes("#ai")) {
      router.push("/ai");
    } else if (window.location.href.includes("#teachers")) {
      router.push("/");
    }
  }, [router]);

  const { posts, pageData, topNav, curriculumPhaseOptions } = props;

  const testimonials = pageData?.testimonials;
  const intro = pageData?.intro;
  const campaignPromoBanner = pageData.campaignPromoBanner;

  return (
    <AppLayout
      seoProps={{
        title: "Free, time-saving teacher resources | Oak National Academy",
        description:
          "Explore our free, time-saving teacher resources from Oak National Academy. Browse and download worksheets, quizzes and slides from KS1 to KS4. ",
      }}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <Banners />
      <HomePageTabImageNav current={"teachers"} />
      <TeachersTab
        curriculumPhaseOptions={curriculumPhaseOptions}
        aria-current="page"
      />
      <HomePageLowerView
        campaignPromoBanner={campaignPromoBanner}
        posts={posts}
        testimonials={testimonials}
        introVideo={intro}
      />
    </AppLayout>
  );
};

const fetchSubjectPhasePickerData: () => Promise<SubjectPhasePickerData> =
  async () => {
    const subjects = await curriculumApi2023.curriculumPhaseOptions();
    return {
      subjects: filterValidCurriculumPhaseOptions(subjects),
      tab: "units",
    };
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

      const curriculumPhaseOptions = await fetchSubjectPhasePickerData();

      const topNav = await curriculumApi2023.topNav();

      const results: GetStaticPropsResult<HomePageProps> = {
        props: {
          pageData,
          curriculumPhaseOptions,
          posts,
          topNav,
        },
      };
      return results;
    },
  });
};

export default HomePage;
