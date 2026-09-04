import { Metadata } from "next";
import z from "zod";
import { notFound } from "next/navigation";

import { PageSearchParms } from "../programmes/[slug]/[tab]/page";

import { TeachWithOakView } from "./components/TeachWithOakView";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getFeatureFlagValue } from "@/utils/featureFlags";


export const metadata: Metadata = {
  title: "Search for Free Teaching Resources",
  description: "Search for Free Teaching Resources",
  robots: {
    index: false,
    follow: true,
  },
};

const teachWithOakParams = z.object({
  returnTo: z.string(),
});

const InnerTeachWithOakPage = async (props: {
  searchParams?: Promise<PageSearchParms>;
}) => {
  const isEnabled = await getFeatureFlagValue("teach-with-oak-page", "boolean");

  if (!isEnabled) {
    return notFound();
  }

  const query = await props.searchParams;

  const getLessonLink = () => {
    if (query) {
      const parsedParams = teachWithOakParams.safeParse(query);
      if (parsedParams.success) {
        const { returnTo } = parsedParams.data;
        return returnTo;
      }
    }
  };

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <TeachWithOakView backToLessonLink={getLessonLink()} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const ProgrammePage = withPageErrorHandling(
  InnerTeachWithOakPage,
  "teach-with-oak::app",
);

export default ProgrammePage;
