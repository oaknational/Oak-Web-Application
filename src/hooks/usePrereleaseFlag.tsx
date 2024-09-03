import { useEffect, useState } from "react";

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

export function wrapPreRelease<P extends object>(
  Component: React.FC<P>,
  key: string,
) {
  return function Prerelease(props: P) {
    const enabled = usePrereleaseFlag(key);
    if (enabled) {
      return <Component {...props} />;
    } else {
      return <div />;
    }
  };
}
