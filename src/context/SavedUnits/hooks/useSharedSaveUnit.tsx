import { useState } from "react";
import { useStore } from "zustand";

import { SavedUnitsStore } from "../SavedUnitsStore";

import { TrackingProgrammeData } from "@/node-lib/educator-api/helpers/saveUnits/utils";

export function useSharedSaveUnit(
  store: SavedUnitsStore,
  programmeSlug: string,
  unitSlug: string,
  tracking: TrackingProgrammeData,
) {
  const isSaved = useStore(
    store,
    (state) => state.programmes[programmeSlug]?.saved.has(unitSlug) ?? false,
  );
  const isSaving = useStore(
    store,
    (state) => state.programmes[programmeSlug]?.pending.has(unitSlug) ?? false,
  );
  const [showSignIn, setShowSignIn] = useState(false);

  return {
    isSaved,
    isSaving,
    showSignIn,
    setShowSignIn,
    onSaveToggle: () => {
      const state = store.getState();
      if (!state.canSave) setShowSignIn(true);
      else state.toggle(programmeSlug, unitSlug, tracking);
    },
  };
}
