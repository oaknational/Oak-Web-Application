import { FC, ReactNode } from "react";

export const PromoSpan: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <span
      style={{
        display: "inline-block",
        transform: "rotate(-1.5deg)",
        padding: "4px 8px",
        background:
          "conic-gradient(from 90deg at 50% 50%, #BEF2BD 97.20000386238098deg, #F6E8A0 284.40000772476196deg, #B0E2DE 360deg)",
      }}
    >
      {children}
    </span>
  );
};
