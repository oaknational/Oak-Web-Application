// Adapted from:
// https://usehooks-ts.com/react-hook/use-local-storage
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import isEqual from "lodash/isEqual";
import { z } from "zod";

import useStableCallback from "./useStableCallback";
import useEventListener from "./useEventListener";

const LOCAL_STORAGE_EVENT = "local-storage";

/**
 * Use a valuePending symbol so that we don't rely on null/undefined which
 * could be a valid value.
 * This way we can differentiate between no value (or pending value) and a set
 * value.
 */
const valuePending = Symbol("value-pending");
type ValuePending = typeof valuePending;

declare global {
  interface WindowEventMap {
    [LOCAL_STORAGE_EVENT]: CustomEvent;
  }
}

type SetValue<T> = Dispatch<SetStateAction<T>>;

export const dispatchLocalStorageEvent = () => {
  window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
};

const callIfFunction = <T>(value: T) => {
  if (typeof value === "function") {
    return value();
  }
  return value;
};

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  // pass an areEqual function to ensure state doesn't get updated too often
  areEqual?: (a: T, b: T) => boolean,
  schema?: z.ZodSchema<T>
): [T, SetValue<T>] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readLSValue = useRef((): T | ValuePending => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === "undefined") {
      return valuePending;
    }

    try {
      const item = window.localStorage.getItem(key);
      const parsedItem = item ? (parseJSON(item) as T) : valuePending;

      // If schema is provided, validate the parsed item
      if (schema && !schema.safeParse(parsedItem).success) {
        return valuePending;
      }
      
      return parsedItem;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return valuePending;
    }
  }).current;

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [stateValue, setStateValue] = useState<T | ValuePending>(readLSValue);
  // currentValue is either the stateValue or the initialValue
  const currentValue =
    stateValue === valuePending ? callIfFunction(initialValue) : stateValue;
  const localStorageValue = readLSValue();

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const onValueChange: SetValue<T> = (value) => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === "undefined") {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(currentValue) : value;

      if (isEqual(newValue, localStorageValue)) {
        // If newValue is the same as the value currently in local storage, don't update
        return;
      }

      if (
        typeof areEqual === "function" &&
        localStorageValue !== valuePending &&
        areEqual(newValue, localStorageValue)
      ) {
        // If areEqual function is passed, and old/new values are equal, don't update
        return;
      }

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(newValue));

      // Save state
      setStateValue(newValue);

      // We dispatch a custom event so every useLocalStorage hook are notified
      dispatchLocalStorageEvent();
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  const setValue = useStableCallback(onValueChange);

  useEffect(() => {
    // Store the initialValue if no value present
    if (readLSValue() === valuePending && initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [readLSValue, setValue, initialValue]);

  useEffect(() => {
    setStateValue(readLSValue());
  }, [readLSValue]);

  const handleStorageChange = () => {
    setStateValue(readLSValue());
  };

  // this only works for other documents, not the current one
  useEventListener("storage", handleStorageChange);
  // see dispatchLocalStorageEvent()
  useEventListener(LOCAL_STORAGE_EVENT, handleStorageChange);

  return [currentValue, setValue];
}

export default useLocalStorage;

// A wrapper for "JSON.parse()"" to support "undefined" value
export function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === "undefined" ? undefined : JSON.parse(value ?? "");
  } catch (error) {
    console.log("parsing error on", { value });
    return undefined;
  }
}
