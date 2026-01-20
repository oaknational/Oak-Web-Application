import { notFound } from "next/navigation";

import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import TopNav from "@/components/AppComponents/TopNav/TopNav";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

// TD: [integrated journey] get revalidate from env somehow
// revalidate in layout controls revalidation of child pages in route
export const revalidate = 7200;

export default async function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const topNavProps = await curriculumApi2023.topNav();

    return (
      <>
        <TopNav {...topNavProps} />
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
    // TD: [integrated journey] error reporting
    throw error;
  }
}
