"use server";

import { GetToken } from "clerk";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { getUserListContent } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { buildCollectionData } from "@/node-lib/educator-api/helpers/saveUnits/buildCollectionData";
import MyLibrary, {
  CollectionData,
} from "@/components/TeacherViews/MyLibrary/MyLibrary";

const reportError = errorReporter("educatorApi");

interface MyLibraryContentProps {
  getToken: GetToken;
  userId: string;
}

export async function MyLibraryContent({
  getToken,
  userId,
}: Readonly<MyLibraryContentProps>) {
  let collectionData: CollectionData = [];
  try {
    const savedUnits = await getUserListContent(getToken, userId);
    collectionData = buildCollectionData(savedUnits);
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
      <MyLibrary collectionData={collectionData} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
}
