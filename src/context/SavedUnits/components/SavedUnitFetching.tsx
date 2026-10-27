import { useEffect } from "react";

import { SavedUnitsStore } from "../SavedUnitsStore";
import { unitsResponseSchema } from "../savedUnits.types";

import errorReporter from "@/common-lib/error-reporter";
import { useGetEducatorData } from "@/node-lib/educator-api/helpers/useGetEducatorData";

const reportError = errorReporter("educatorApi");

// This component handles fetching saved units for a programme and updating the store with the response.
// Keeping it in a component allows us to render one component for each programme in isolation.
export function SavedUnitFetching({
  programmeSlug,
  store,
}: {
  programmeSlug: string;
  store: SavedUnitsStore;
}) {
  const { data, error } = useGetEducatorData<unknown>(
    `/api/educator/getSavedUnits/${programmeSlug}`,
  );

  useEffect(() => {
    if (error) {
      reportError(error);
    }
  }, [error]);

  useEffect(() => {
    if (data === undefined) return;
    const parsed = unitsResponseSchema.safeParse(data);
    if (!parsed.success) {
      reportError(parsed.error, { savedUnitsData: data });
      return;
    }
    store.setState((state) => {
      const current = state.programmes[programmeSlug];
      const saved = new Set(parsed.data);
      // Revalidation must not overwrite optimistic changes still in flight.
      current?.pending.forEach((slug) => {
        if (current.saved.has(slug)) saved.add(slug);
        else saved.delete(slug);
      });
      return {
        programmes: {
          ...state.programmes,
          [programmeSlug]: {
            saved,
            pending: current?.pending ?? new Set<string>(),
          },
        },
      };
    });
  }, [data, programmeSlug, store]);

  return null;
}
