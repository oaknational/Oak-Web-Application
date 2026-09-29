import { Metadata } from "next";

import { TeachWithOakView } from "./components/TeachWithOakView";

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

const InnerTeachWithOakPage = async () => {
  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <TeachWithOakView />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const TeachWithOakPage = withPageErrorHandling(
  InnerTeachWithOakPage,
  "teach-with-oak::app",
);

export default TeachWithOakPage;
