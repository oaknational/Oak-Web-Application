import { useEffect, useRef } from "react";
import { OakBox } from "@oaknational/oak-components";

import useAnalytics from "@/context/Analytics/useAnalytics";

export type TrackScrolledToProps = {
  eventKey: string;
};

/*
  Component to track when a user scrolls to a specific section of the page.
*/
export default function TrackScrolledTo({
  eventKey,
}: Readonly<TrackScrolledToProps>) {
  const { track } = useAnalytics();
  const ref = useRef<HTMLDivElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasTracked.current) {
          hasTracked.current = true;
          track.scrolledTo({ key: eventKey });
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "-1px 0px 0px" },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, eventKey, track]);

  return <OakBox ref={ref} />;
}
