// https://usehooks-ts.com/react-hook/use-local-storage
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import useStableCallback from "./useStableCallback";
import useEventListener from "./useEventListener";

const LOCAL_STORAGE_EVENT = "local-storage";

declare global {
  interface WindowEventMap {
    [LOCAL_STORAGE_EVENT]: CustomEvent;
  }
}

type SetValue<T> = Dispatch<SetStateAction<T>>;

export const dispatchLocalStorageEvent = () => {
  window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
};

/**
 * @TODO we should add zod schema argument to this hook, so that if the value
 * changes shape, it sets the value to null, rather than passing back an
 * incorrect value which could then lead to an unhandled exception.
 * The other option would be to use versioning, in a solution such as
 * indexdb. But that is much more involved and likely beyond what we need.
 * The case fall indexdb will arise when we want to use local storage to
 * facilitate "personalisation" features for visitors who aren't logged in.
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T,
  // pass an areEqual function to ensure state doesn't get updated too often
  areEqual?: (a: T, b: T) => boolean
): [T, SetValue<T>] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useRef((): T => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (parseJSON(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }).current;

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const onValueChange: SetValue<T> = (value) => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window == "undefined") {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value;

      if (newValue === storedValue) {
        return;
      }

      if (typeof areEqual === "function" && areEqual(newValue, storedValue)) {
        // If areEqual function is passed, and old/new values are equal, don't update
        return;
      }

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(newValue));

      if (newValue === storedValue) {
        // Don't update if old and new values same
        return;
      }

      if (typeof areEqual === "function" && areEqual(newValue, storedValue)) {
        // If areEqual function is passed, and old/new values are equivalent, don't update
        return;
      }

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(newValue));

      // Save state
      setStoredValue(newValue);

      // We dispatch a custom event so every useLocalStorage hook are notified
      dispatchLocalStorageEvent();
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  const setValue = useStableCallback(onValueChange);

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  const handleStorageChange = () => {
    setStoredValue(readValue());
  };

  // this only works for other documents, not the current one
  useEventListener("storage", handleStorageChange);

  // this is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  useEventListener(LOCAL_STORAGE_EVENT, handleStorageChange);

  return [storedValue, setValue];
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
