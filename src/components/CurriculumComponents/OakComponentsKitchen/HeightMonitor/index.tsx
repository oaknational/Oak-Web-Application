import { useEffect, useRef } from "react";

type HeightMonitorProps = {
  children: React.ReactNode;
  onChange: (newHeight: number) => void;
};
export function HeightMonitor({ onChange, children }: HeightMonitorProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const boundingRect = ref.current.getBoundingClientRect();
      onChange(boundingRect.height);
    }
  }, [ref, onChange]);

  return <div ref={ref}>{children}</div>;
}
