"use client";

import { Wall } from "@/components/AppComponents/Wall";
import MyLibrary from "@/components/TeacherViews/MyLibrary/MyLibrary";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { useMyLibrary } from "@/node-lib/educator-api/helpers/saveUnits/useMyLibrary";

function MyLibraryContent() {
  const { collectionData, isLoading } = useMyLibrary();

  return <MyLibrary collectionData={collectionData} isLoading={isLoading} />;
}

export const MyLibraryView = withPageAuthRequired(
  withOnboardingRequired(MyLibraryContent, Wall),
  Wall,
);
