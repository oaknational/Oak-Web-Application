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
