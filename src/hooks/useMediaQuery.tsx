import { useEffect, useState } from "react";

import { Device, getMediaQuery } from "@/styles/utils/responsive";

const useMediaQuery = (device: Device) => {
  const [matches, setMatches] = useState(false);

  const query = getMediaQuery(device);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export default useMediaQuery;
