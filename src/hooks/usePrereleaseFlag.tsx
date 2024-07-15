import { useEffect, useState } from "react";
import type { ComponentType } from "react";

import { getPrereleaseFlag } from "@/utils/getPrereleaseFlag";

export default function usePrereleaseFlag(key: string) {
  const [state, setState] = useState(false);
  useEffect(() => {
    setState(getPrereleaseFlag(key));
    return () => {
      setState(false);
    };
  }, [key]);
  return state;
}

export function wrapPreRelease<T extends ComponentType<P>, P extends object>(
  Component: T,
  key: string,
) {
  return function Prerelease(props: JSX.LibraryManagedAttributes<T, P>) {
    const enabled = usePrereleaseFlag(key);
    if (enabled) {
      return <Component {...props} />;
    } else {
      return <div />;
    }
  };
}

// export function wrapPreRelease<T extends ComponentType<any>>(Component: T, key: string): FC<React.ComponentProps<T>> {
//   return function Prerelease(props: React.ComponentProps<T>) {
//     const enabled = usePrereleaseFlag(key);
//     if (enabled) {
//       return <Component {...props} />;
//     } else {
//       return <div />;
//     }
//   };
// }
