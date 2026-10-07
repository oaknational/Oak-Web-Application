import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import { MyLibraryView } from "./MyLibraryView";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { resolveOakHref } from "@/common-lib/urls";
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

export const dynamic = "force-dynamic";

const MyLibraryPage = async () => {
  const returnTo = resolveOakHref({ page: "my-library" });
  const { userId, redirectToSignUp } = await auth();

  if (!userId) {
    return redirectToSignUp({ returnBackUrl: returnTo });
  }

  const user = await currentUser();

  if (!user?.publicMetadata.owa?.isOnboarded) {
    redirect(
      `${resolveOakHref({ page: "onboarding" })}?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

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
