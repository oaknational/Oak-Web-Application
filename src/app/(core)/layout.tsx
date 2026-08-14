import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import TopNav from "@/components/AppComponents/TopNav/TopNav";
import OakError from "@/errors/OakError";
import LayoutPreviewControls from "@/components/AppComponents/LayoutPreviewControls";
import { SimulateErrorControls } from "@/app/components/ErrorHandling/SimulateErrorControls";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

// TD: [integrated journey] get revalidate from env somehow
// revalidate in layout controls revalidation of child pages in route
export const revalidate = 7200;

export default async function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const topNavProps =
      process.env.NATIONAL_CURRICULUM_INSIGHTS_LOCAL_PREVIEW_RUNTIME === "true"
        ? topNavFixture
        : await (
            await import("@/node-lib/curriculum-api-2023")
          ).default.topNav({
            withCache: true,
          });
    const { isEnabled } = await draftMode();

    return (
      <>
        <TopNav {...topNavProps} />
        <SimulateErrorControls errorBoundaryLevel="root" />
        <main id="main">{children}</main>
        <LayoutSiteFooter />
        {isEnabled && <LayoutPreviewControls />}
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
