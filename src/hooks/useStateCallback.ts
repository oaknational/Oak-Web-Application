import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A hook with a callback for when the state is updated.
 * NB. the new state is passed as an argument to the callback.
 *
 * Taken from https://stackoverflow.com/a/61842546/899616
 *
 */

export function useStateCallback<T>(
  initialState: T,
): [T, (state: T | ((prevState: T) => T), cb?: (state: T) => void) => void] {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<((state: T) => void) | undefined>(undefined); // init mutable ref container for callbacks

  const setStateCallback = useCallback(
    (state: T | ((prevState: T) => T), cb?: (state: T) => void) => {
      cbRef.current = cb; // store current, passed callback in ref
      setState(state);
    },
    [],
  ); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `undefined` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = undefined; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}
