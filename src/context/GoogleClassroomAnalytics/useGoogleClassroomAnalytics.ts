"use client";

import { createContext, useContext } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand/vanilla";

import type {
  GoogleClassroomAnalyticsActions,
  GoogleClassroomAnalyticsStore,
} from "./SharedTypes";

export const googleClassroomAnalyticsContext =
  createContext<StoreApi<GoogleClassroomAnalyticsStore> | null>(null);

const defaultGoogleClassroomAnalyticsSelector = (
  state: GoogleClassroomAnalyticsStore,
): GoogleClassroomAnalyticsActions => {
  return state.actions;
};

export function useGoogleClassroomAnalytics(): GoogleClassroomAnalyticsActions;
export function useGoogleClassroomAnalytics<T>(
  selector: (state: GoogleClassroomAnalyticsStore) => T,
): T;
export function useGoogleClassroomAnalytics<T>(
  selector?: (state: GoogleClassroomAnalyticsStore) => T,
) {
  const store = useContext(googleClassroomAnalyticsContext);

  if (!store) {
    throw new Error(
      "useGoogleClassroomAnalytics called outside of GoogleClassroomAnalyticsProvider",
    );
  }

  return useStore(
    store,
    (selector ?? defaultGoogleClassroomAnalyticsSelector) as (
      state: GoogleClassroomAnalyticsStore,
    ) => T,
  );
}
