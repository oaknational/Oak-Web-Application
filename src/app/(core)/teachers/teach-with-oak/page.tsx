import { Metadata } from "next";

import { TeachWithOakView } from "./components/TeachWithOakView";

import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export const metadata: Metadata = {
  title: "",
  description: "",
  robots: {
    index: true,
    follow: true,
  },
};

const TeachWithOakPage = () => {
  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <TeachWithOakView />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export default TeachWithOakPage;
