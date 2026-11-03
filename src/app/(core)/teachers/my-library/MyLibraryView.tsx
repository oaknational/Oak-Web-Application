"use client";

import { useMemo } from "react";

import MyLibrary from "@/components/TeacherViews/MyLibrary/MyLibrary";
import { buildCollectionData } from "@/node-lib/educator-api/helpers/saveUnits/buildCollectionData";
import { useGetEducatorData } from "@/node-lib/educator-api/helpers/useGetEducatorData";
import { UserlistContentApiResponse } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";

/**
 * Renders the server-fetched units immediately, then picks up saves made
 * elsewhere via SWR revalidation (on mount, focus and reconnect)
 */
export function MyLibraryView({
  savedUnits,
}: Readonly<{ savedUnits: UserlistContentApiResponse | null }>) {
  const { data } = useGetEducatorData<UserlistContentApiResponse>(
    "/api/educator/getSavedContentLists",
    { fallbackData: savedUnits ?? undefined },
  );

  const collectionData = useMemo(
    () => (data ? buildCollectionData(data) : null),
    [data],
  );

  return <MyLibrary collectionData={collectionData} />;
}
