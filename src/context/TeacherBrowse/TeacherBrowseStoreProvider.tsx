"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  createTeacherBrowseStore,
  type TeacherBrowseStore,
} from "./TeacherBrowseStore";
import { useStore } from "zustand";

export type TeacherBrowseStoreApi = ReturnType<typeof createTeacherBrowseStore>;
export const TeacherBrowseStoreContext = createContext<
  TeacherBrowseStoreApi | undefined
>(undefined);

export interface TeacherBrowseStoreProviderProps {
  initialState: TeacherBrowseStore;
  children: ReactNode;
}

export const TeacherBrowseStoreProvider = ({
  initialState,
  children,
}: TeacherBrowseStoreProviderProps) => {
  const [store] = useState(() => createTeacherBrowseStore(initialState));
  return (
    <TeacherBrowseStoreContext.Provider value={store}>
      {children}
    </TeacherBrowseStoreContext.Provider>
  );
};

export const useTeacherBrowseStore = <T,>(
  selector: (store: TeacherBrowseStore) => T,
): T => {
  const teacherBrowseStoreContext = useContext(TeacherBrowseStoreContext);
  if (!teacherBrowseStoreContext) {
    throw new Error(
      `useTeacherBrowseStore must be used within TeacherBrowseStoreProvider`,
    );
  }

  return useStore(teacherBrowseStoreContext, selector);
};
