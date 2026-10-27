import { createContext } from "react";
import { createStore } from "zustand";

import { SavedUnitsState } from "./savedUnits.types";

export const createSaveUnitsStore = () =>
  createStore<SavedUnitsState>(() => ({
    programmes: {},
    toggle: () => {
      throw new Error("SaveUnitsProvider is not ready");
    },
    canSave: false,
  }));

export type SavedUnitsStore = ReturnType<typeof createSaveUnitsStore>;
export const SavedUnitsContext = createContext<SavedUnitsStore | null>(null);
