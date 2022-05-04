import { useCallback, useLayoutEffect, useRef } from "react";

const useEvent = <T extends (...args: unknown[]) => unknown>(handler: T) => {
  const handlerRef = useRef<T>(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => {
    return handlerRef.current(...args);
  }, []);
};

export default useEvent;
