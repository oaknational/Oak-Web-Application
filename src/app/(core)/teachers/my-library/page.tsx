import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { resolveOakHref } from "@/common-lib/urls";
import MyLibrary, {
  CollectionData,
} from "@/components/TeacherViews/MyLibrary/MyLibrary";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { getMyLibraryCollections } from "@/node-lib/educator-api/helpers/saveUnits/getMyLibraryCollections";

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

  // Render the empty library rather than an error page if the saved units can't be fetched
  let collectionData: CollectionData | null = null;
  try {
    collectionData = await getMyLibraryCollections(getToken, userId);
  } catch (err) {
    reportError(
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
      <MyLibrary collectionData={collectionData} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export default MyLibraryPage;
