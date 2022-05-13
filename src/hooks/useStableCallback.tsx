import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Similar to https://github.com/reactjs/rfcs/pull/220 (and other similar
 * solutions adopted by many in the React community).
 * To be used in specific circumstances where your function needs to be
 * able to read the latest props/state but have stable reference.
 * Specifically, such a handler will not trigger effects when passed
 * in the dependency array list.
 *
 */
const useStableCallback = <T,>(handler: T): T => {
  const handlerRef = useRef<T>(handler);

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      handlerRef.current = () => null;
    };
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return useCallback((...args) => {
    if (typeof handlerRef.current !== "function") {
      return console.warn(
        `useStableCallback handlerRef.current should be type function but is of type ${typeof handlerRef.current}`
      );
    }
    return handlerRef.current(...args);
  }, []);
};

export default useStableCallback;
