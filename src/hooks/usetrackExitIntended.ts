import { useEffect } from "react";

import useAnalytics from "@/context/Analytics/useAnalytics";

/*
  Hook to track when a user intends to exit the page by moving their mouse cursor outside the top of the viewport.
  Can be used to trigger exit-intent popups or other user engagement strategies.
*/
export default function useTrackExitIntended() {
  const { track } = useAnalytics();

  useEffect(() => {
    const handleMouseOutOfWindow = (e: MouseEvent) => {
      // Check if cursor moves outside the top of the window viewport
      if (e.clientY <= 0 && !e.relatedTarget) {
        track.exitIntended();
      }
    };

    window.addEventListener("mouseout", handleMouseOutOfWindow);
    return () => {
      window.removeEventListener("mouseout", handleMouseOutOfWindow);
    };
  }, [track]);
}
