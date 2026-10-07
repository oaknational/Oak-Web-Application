import { Metadata } from "next";

import { MyLibraryView } from "./MyLibraryView";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

const title = "My library";
const description = "Save units to your own personal library";

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: getOpenGraphMetadata({ title, description }),
  twitter: getTwitterMetadata({ title, description }),
};

const MyLibraryPage = () => {
  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="my_library"
    >
      <MyLibraryView />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export default MyLibraryPage;
