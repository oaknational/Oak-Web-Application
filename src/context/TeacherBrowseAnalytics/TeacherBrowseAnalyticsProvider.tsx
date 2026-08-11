"use client";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useStore } from "zustand";

import useAnalytics from "../Analytics/useAnalytics";

import {
  createTeacherBrowseAnalyticsStore,
  TeacherBrowseAnalyticsStore,
} from "./TeacherBrowseAnalyticsStore";

export type TeacherBrowseAnalyticsStoreApi = ReturnType<
  typeof createTeacherBrowseAnalyticsStore
>;
export const TeacherBrowseAnalyticsStoreContext = createContext<
  TeacherBrowseAnalyticsStoreApi | undefined
>(undefined);

export interface TeacherBrowseAnalyticsStoreProviderProps {
  programmeState: Pick<TeacherBrowseAnalyticsStore, "programmeState">;
  children: ReactNode;
}

export const TeacherBrowseAnalyticsStoreProvider = ({
  programmeState,
  children,
}: TeacherBrowseAnalyticsStoreProviderProps) => {
  const { track, getSessionId } = useAnalytics();

  const sessionId = useMemo(() => getSessionId(), [getSessionId]);

  const journeyId = useMemo(() => {
    if (!sessionId) {
      return null;
    }
    return `${sessionId}:${programmeState.programmeState.programmeSlug}`;
  }, [sessionId, programmeState.programmeState.programmeSlug]);

  const [store] = useState(() =>
    createTeacherBrowseAnalyticsStore({
      ...programmeState,
      avo: track,
      journeyId,
    }),
  );

  return (
    <TeacherBrowseAnalyticsStoreContext.Provider value={store}>
      {children}
    </TeacherBrowseAnalyticsStoreContext.Provider>
  );
};

export const useTeacherBrowseAnalytics = <T,>(
  selector: (store: TeacherBrowseAnalyticsStore) => T,
): T => {
  const teacherBrowseAnalyticsStoreContext = useContext(
    TeacherBrowseAnalyticsStoreContext,
  );
  if (!teacherBrowseAnalyticsStoreContext) {
    throw new Error(
      `useTeacherBrowseAnalyticsStore must be used within TeacherBrowseAnalyticsStoreProvider`,
    );
  }

  return useStore(teacherBrowseAnalyticsStoreContext, selector);
};
