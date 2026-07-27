"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  programmeState?: Pick<TeacherBrowseAnalyticsStore, "programmeState">;
  children: ReactNode;
}

export const TeacherBrowseAnalyticsStoreProvider = ({
  programmeState,
  children,
}: TeacherBrowseAnalyticsStoreProviderProps) => {
  const { track, getSessionId } = useAnalytics();

  const sessionId = useMemo(() => getSessionId(), [getSessionId]);

  const journeyId = useMemo(() => {
    if (!sessionId || !programmeState?.programmeState) {
      return null;
    }
    return `${sessionId}:${programmeState.programmeState.programmeSlug}`;
  }, [sessionId, programmeState?.programmeState]);

  const [store] = useState(() =>
    createTeacherBrowseAnalyticsStore({
      programmeState: programmeState?.programmeState ?? null,
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

export const useOptionalTeacherBrowseAnalytics = <T,>(
  selector: (store: TeacherBrowseAnalyticsStore) => T,
): T => {
  const { track } = useAnalytics();
  const teacherBrowseAnalyticsStoreContext = useContext(
    TeacherBrowseAnalyticsStoreContext,
  );
  const fallbackStoreRef = useRef<TeacherBrowseAnalyticsStoreApi | null>(null);

  fallbackStoreRef.current ??= createTeacherBrowseAnalyticsStore({
    programmeState: null,
    avo: track,
    journeyId: null,
  });

  useEffect(() => {
    fallbackStoreRef.current?.setState({ avo: track });
  }, [track]);

  const store = teacherBrowseAnalyticsStoreContext ?? fallbackStoreRef.current;

  return useStore(store, selector);
};
