"use client";

import MyLibrary from "@/components/TeacherViews/MyLibrary/MyLibrary";
import { useMyLibrary } from "@/node-lib/educator-api/helpers/saveUnits/useMyLibrary";

export function MyLibraryView() {
  const { collectionData, isLoading } = useMyLibrary();

  return <MyLibrary collectionData={collectionData} isLoading={isLoading} />;
}
