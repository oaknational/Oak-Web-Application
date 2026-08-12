import { GetStaticProps } from "next";

import { URLParams } from "./lessons/[lessonSlug]";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { Wall } from "@/components/AppComponents/Wall";
import AppLayout from "@/components/AppComponents/AppLayout";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import MyLibrary from "@/components/TeacherViews/MyLibrary/MyLibrary";
import { useMyLibrary } from "@/node-lib/educator-api/helpers/saveUnits/useMyLibrary";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

function MyLibraryPage({ topNav }: Readonly<{ topNav: TopNavProps }>) {
  const { collectionData, isLoading } = useMyLibrary();

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: "My library",
          description: "Save units to your own personal library",
        }),
        noIndex: true,
        noFollow: true,
      }}
      topNavProps={topNav}
    >
      <TeacherBrowseAnalyticsStoreProvider
        programmeState={null}
        accessLevel={"my_library"}
      >
        <MyLibrary collectionData={collectionData} isLoading={isLoading} />
      </TeacherBrowseAnalyticsStoreProvider>
    </AppLayout>
  );
}

export const getStaticProps: GetStaticProps<
  { topNav: TopNavProps },
  URLParams
> = async () => {
  const topNav = await curriculumApi2023.topNav();
  return {
    props: {
      topNav,
    },
  };
};

export default withPageAuthRequired(
  withOnboardingRequired(MyLibraryPage, Wall),
  Wall,
);
