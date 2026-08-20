"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStore } from "zustand";
import { useOakConsent } from "@oaknational/oak-consent-client";

import useAnalytics from "../Analytics/useAnalytics";
import OakError from "../../errors/OakError";
import errorReporter from "../../common-lib/error-reporter";

import {
  createTeacherBrowseAnalyticsStore,
  TeacherBrowseAnalyticsStore,
} from "./TeacherBrowseAnalyticsStore";

import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

export type TeacherBrowseAnalyticsStoreApi = ReturnType<
  typeof createTeacherBrowseAnalyticsStore
>;
export const TeacherBrowseAnalyticsStoreContext = createContext<
  TeacherBrowseAnalyticsStoreApi | undefined
>(undefined);

export type TeacherBrowseAnalyticsStoreProviderProps = Pick<
  TeacherBrowseAnalyticsStore,
  "programmeState" | "accessLevel"
> & {
  children: ReactNode;
};

const reportError = errorReporter("teacher-browse-analytics");

export const TeacherBrowseAnalyticsStoreProvider = ({
  programmeState,
  accessLevel,
  children,
}: TeacherBrowseAnalyticsStoreProviderProps) => {
  const { track, getSessionId } = useAnalytics();
  const subjectSlug = programmeState?.subjectSlug ?? "unknown";
  const phaseSlug = programmeState?.phaseSlug ?? "unknown";
  const posthogConsent = useOakConsent().getConsent(ServicePolicyMap.POSTHOG);
  const hasConsent = posthogConsent === "granted";

  const journeyId = useMemo(() => {
    if (!hasConsent) {
      return null;
    }
    const sessionId = getSessionId();

    if (!sessionId) {
      // user consented to cookies but does not have a session id
      reportError(
        new OakError({
          code: "analytics/teacher-browse",
          meta: {
            sessionId,
            message: "Missing session id",
          },
        }),
      );
      return null;
    }
    return `${sessionId}:${phaseSlug}-${subjectSlug}`;
  }, [hasConsent, getSessionId, subjectSlug, phaseSlug]);

  const [store] = useState(() =>
    createTeacherBrowseAnalyticsStore({
      programmeState,
      avo: track,
      journeyId,
      accessLevel,
    }),
  );

  useEffect(() => {
    store.setState({ journeyId, programmeState, accessLevel });
  }, [store, journeyId, programmeState, accessLevel]);

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
