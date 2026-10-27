import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

import { useOakNotificationsContext } from "../../OakNotifications/useOakNotificationsContext";
import useSaveCountContext from "../../SaveCount/useSaveCountContext";
import { SavedUnitsStore } from "../SavedUnitsStore";
import { useTeacherBrowseAnalytics } from "../../TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { SavedUnitsState } from "../savedUnits.types";

import {
  UnsavedToastProps,
  SavedToastProps,
  ErrorToastProps,
} from "@/node-lib/educator-api/helpers/saveUnits/utils";
import { postEducatorData } from "@/node-lib/educator-api/helpers/postEducatorData";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("educatorApi");

// This component registers store actions using auth, notification and analytics dependencies.
// Keeping it as a separate component instead of a hook isolates their rerenders from the provider.
export function SavedUnitActions({ store }: { store: SavedUnitsStore }) {
  const { isSignedIn, user } = useUser();
  const { setCurrentToastProps } = useOakNotificationsContext();
  const { incrementSavedUnitsCount, decrementSavedUnitsCount } =
    useSaveCountContext();
  const { contentSaved, contentUnsaved } = useTeacherBrowseAnalytics(
    (state) => state.track,
  );

  const canSave = !!(isSignedIn && user?.publicMetadata?.owa?.isOnboarded);

  useEffect(() => {
    const toggle: SavedUnitsState["toggle"] = (
      programmeSlug,
      unitSlug,
      tracking,
    ) => {
      void (async () => {
        const programme = store.getState().programmes[programmeSlug];
        if (!canSave || programme?.pending.has(unitSlug)) return;
        const wasSaved = programme?.saved.has(unitSlug) ?? false;

        const update = (savedValue: boolean, pendingValue: boolean) => {
          store.setState((state) => {
            const current = state.programmes[programmeSlug];
            const saved = new Set(current?.saved);
            const pending = new Set(current?.pending);
            if (savedValue) saved.add(unitSlug);
            else saved.delete(unitSlug);
            if (pendingValue) pending.add(unitSlug);
            else pending.delete(unitSlug);
            return {
              programmes: {
                ...state.programmes,
                [programmeSlug]: { saved, pending },
              },
            };
          });
        };

        update(!wasSaved, true);
        setCurrentToastProps(wasSaved ? UnsavedToastProps : SavedToastProps);
        if (wasSaved) {
          decrementSavedUnitsCount();
        } else {
          incrementSavedUnitsCount();
        }

        let succeeded = false;
        try {
          const endpoint = `/api/educator/${wasSaved ? "unsaveUnit" : "saveUnit"}/${programmeSlug}/${unitSlug}`;
          succeeded = await postEducatorData(endpoint);
        } catch (error) {
          reportError(error);
        } finally {
          update(succeeded ? !wasSaved : wasSaved, false);
          if (!succeeded) {
            setCurrentToastProps(ErrorToastProps);
            if (wasSaved) incrementSavedUnitsCount();
            else decrementSavedUnitsCount();
          }
        }
        if (succeeded) {
          const track = wasSaved ? contentUnsaved : contentSaved;
          track({
            componentType: tracking.savedFrom,
            keyStageSlug: tracking.keyStageSlug,
            keyStageTitle: tracking.keyStageTitle,
            subjectSlug: tracking.subjectSlug,
            subjectTitle: tracking.subjectTitle,
            contentType: "unit",
            contentItemSlug: unitSlug,
          });
        }
      })();
    };
    store.setState({ toggle, canSave });
  }, [
    store,
    canSave,
    setCurrentToastProps,
    incrementSavedUnitsCount,
    decrementSavedUnitsCount,
    contentSaved,
    contentUnsaved,
  ]);

  return null;
}
