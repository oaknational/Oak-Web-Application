import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

const COOKIE_STORAGE_EVENT = "oak-cookie-flag-change";
const PREFIX = "oak-flag";

const channel = new BroadcastChannel(COOKIE_STORAGE_EVENT);

export type SetValue<T> = Dispatch<SetStateAction<T>>;

function deriveKey(key: string): string {
  return [PREFIX, key].join("-");
}

type Opts = {
  flags: string[];
  activeFlags: string[];
  cookieStore?: ReadonlyRequestCookies | CookieStore;
};

const isClient = typeof window !== "undefined";

export function useCookieFlag(
  rawKey: string,
  {
    activeFlags,
    cookieStore = isClient ? window.cookieStore : undefined,
    flags,
  }: Opts,
): [boolean, SetValue<boolean>] {
  const key = deriveKey(rawKey);
  const [currentValueLocal, setCurrentValueLocal] = useState(() => {
    return activeFlags.includes(key);
  });

  // Cleanup any cookies that are not in the flags list.
  const cleanupOldCookieFlags = useCallback(async () => {
    if (cookieStore && isClient) {
      const currentCookies = await (cookieStore instanceof CookieStore
        ? cookieStore.getAll()
        : cookieStore.getAll(""));

      for (const { name } of currentCookies) {
        if (name?.startsWith(PREFIX) && !flags.includes(rawKey)) {
          cookieStore.delete(name);
        }
      }
    }
  }, [rawKey, cookieStore, flags]);

  useEffect(() => {
    cleanupOldCookieFlags();
  }, [cleanupOldCookieFlags]);

  useEffect(() => {
    const update = async () => {
      if (cookieStore) {
        const currentCookies = await (cookieStore instanceof CookieStore
          ? cookieStore.getAll()
          : cookieStore.getAll(""));
        for (const { name, value } of currentCookies) {
          if (name === key) {
            setCurrentValueLocal(value === "1");
          }
        }
      }
    };
    const hdl = async (e: MessageEvent) => {
      if (e.data?.type === COOKIE_STORAGE_EVENT) {
        update();
      }
    };

    update();
    channel.addEventListener("message", hdl);
    return () => {
      channel.removeEventListener("message", hdl);
    };
  }, [cookieStore, key]);

  const setValue = useCallback(
    async (value: SetStateAction<boolean>) => {
      if (!cookieStore) throw new Error("cookieStore is not available");
      const newValue =
        typeof value === "function" ? value(currentValueLocal) : value;

      if (newValue) {
        await cookieStore.set(key, "1");
      } else {
        await cookieStore.delete(key);
      }
      channel.postMessage({ type: COOKIE_STORAGE_EVENT });
      setCurrentValueLocal(newValue);
    },
    [cookieStore, currentValueLocal, key],
  );

  return [currentValueLocal, setValue];
}
