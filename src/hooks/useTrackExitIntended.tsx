import { useEffect, useRef } from "react";

import useAnalytics from "@/context/Analytics/useAnalytics";

/*
  Hook to track when a user intends to exit the page for the first time by moving their mouse cursor outside the top of the viewport.
  Can be used to trigger exit-intent popups or other user engagement strategies.
*/
export default function useTrackExitIntended() {
  const { track } = useAnalytics();
  const hasTrackedExitIntent = useRef(false);

  useEffect(() => {
    const handleMouseOutOfWindow = (e: MouseEvent) => {
      if (hasTrackedExitIntent.current) {
        return;
      }

      // Check if cursor moves outside the top of the window viewport
      if (e.clientY <= 0 && !e.relatedTarget) {
        hasTrackedExitIntent.current = true;
        track.exitIntended();
        window.removeEventListener("mouseout", handleMouseOutOfWindow);
      }
    };

    window.addEventListener("mouseout", handleMouseOutOfWindow);
    return () => {
      window.removeEventListener("mouseout", handleMouseOutOfWindow);
    };
  }, [track]);
}
