"use cache";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";

import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import TopNav from "@/components/AppComponents/TopNav/TopNav";
import OakError from "@/errors/OakError";
import appRouterTopNavQuery from "@/node-lib/curriculum-api-2023/queries/topNav/appRouterTopNav.query";
import { SimulateErrorControls } from "@/app/components/ErrorHandling/SimulateErrorControls";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export default async function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  cacheLife("curriculum");
  try {
    const topNavProps = await appRouterTopNavQuery();

    return (
      <>
        <TeacherBrowseAnalyticsStoreProvider
          programmeState={null}
          accessLevel="homepage"
        >
          <TopNav {...topNavProps} />
        </TeacherBrowseAnalyticsStoreProvider>
        <SimulateErrorControls errorBoundaryLevel="root" />
        <main id="main">{children}</main>
        <LayoutSiteFooter />
      </>
    );
  } catch (error) {
    if (error instanceof OakError) {
      if (error.config.responseStatusCode === 404) {
        return notFound();
      }
    }
    throw error;
  }
}
