import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import { MyLibraryView } from "./MyLibraryView";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { resolveOakHref } from "@/common-lib/urls";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { getUserListContent } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent";
import { UserlistContentApiResponse } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";

const reportError = errorReporter("educatorApi");

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
  const { userId, getToken, redirectToSignUp } = await auth();

  if (!userId) {
    return redirectToSignUp({ returnBackUrl: returnTo });
  }

  const user = await currentUser();

  if (!user?.publicMetadata.owa?.isOnboarded) {
    redirect(
      `${resolveOakHref({ page: "onboarding" })}?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

  // Fall back to fetching client-side rather than erroring the whole page
  let savedUnits: UserlistContentApiResponse | null = null;
  try {
    savedUnits = await getUserListContent(getToken, userId);
  } catch (err) {
    void reportError(
      new OakError({
        code: "educator-api/failed-to-get-saved-units",
        meta: { userId, error: err },
      }),
    );
  }

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="my_library"
    >
      <MyLibraryView savedUnits={savedUnits} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export default MyLibraryPage;
