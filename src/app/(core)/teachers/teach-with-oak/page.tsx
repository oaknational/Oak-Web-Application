import { Metadata } from "next";

import type { PageSearchParms } from "../programmes/[slug]/[tab]/page";

import { TeachWithOakView } from "./components/TeachWithOakView";
import { getReturnToLessonLink } from "./getReturnToLessonLink";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export const metadata: Metadata = {
  title: "",
  description: "",
  robots: {
    index: true,
    follow: true,
  },
};

const InnerTeachWithOakPage = async (props: {
  searchParams?: Promise<PageSearchParms>;
}) => {
  const query = await props.searchParams;

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <TeachWithOakView backToLessonLink={getReturnToLessonLink({ query })} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const TeachWithOakPage = withPageErrorHandling(
  InnerTeachWithOakPage,
  "teach-with-oak::app",
);

export default TeachWithOakPage;
