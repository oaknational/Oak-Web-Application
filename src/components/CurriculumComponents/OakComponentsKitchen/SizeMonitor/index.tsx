import { useEffect, useRef } from "react";

export type SizeMonitorBounds = Pick<DOMRect, "height" | "width">;

type SizeMonitorProps = {
  children: React.ReactNode;
  onChange: (bounds: SizeMonitorBounds) => void;
};
export default function SizeMonitor({
  onChange,
  children,
}: Readonly<SizeMonitorProps>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const handler = () => {
        if (ref.current) {
          const boundingRect = ref.current.getBoundingClientRect();
          onChange({ width: boundingRect.width, height: boundingRect.height });
        }
      };
      const ro = new ResizeObserver(handler);
      ro.observe(ref.current);
      handler();
      return () => ro.disconnect();
    }
  }, [ref, onChange]);

  return (
    <div
      ref={ref}
      data-testid="size-container"
      style={{ position: "relative" }}
    >
      {children}
    </div>
  );
}
