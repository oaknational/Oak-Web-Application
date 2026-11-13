"use client";

import { useSyncExternalStore } from "react";
import {
  useFeatureFlagEnabled as usePostHogFeatureFlagEnabled,
  useFeatureFlagVariantKey as usePostHogFeatureFlagVariantKey,
} from "posthog-js/react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useHydratedFlagValue<Value>(value: Value): Value | undefined {
  const isHydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return isHydrated ? value : undefined;
}

export function useFeatureFlagEnabled(flag: string) {
  const value = usePostHogFeatureFlagEnabled(flag);
  return useHydratedFlagValue(value);
}

export function useFeatureFlagVariantKey(flag: string) {
  const value = usePostHogFeatureFlagVariantKey(flag);
  return useHydratedFlagValue(value);
}
