import { useEffect, useRef } from "react";
import { OakBox } from "@oaknational/oak-components";

import useAnalytics from "@/context/Analytics/useAnalytics";

export type TrackScrolledToProps = {
  eventKey: string;
};

export default function TrackScrolledTo({
  eventKey,
}: Readonly<TrackScrolledToProps>) {
  const { track } = useAnalytics();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          track.scrolledTo({ key: eventKey });
        }
      },
      { threshold: 0, rootMargin: "-1px 0px 0px" },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, eventKey, track]);

  return <OakBox ref={ref} />;
}
