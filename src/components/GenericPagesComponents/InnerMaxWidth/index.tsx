import { OakBox } from "@oaknational/oak-components";
import { ReactNode } from "react";

export function InnerMaxWidth({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <OakBox
      $maxWidth={"spacing-1280"}
      $mh={"auto"}
      $ph={["spacing-16", "spacing-16", "spacing-0"]}
    >
      {children}
    </OakBox>
  );
}
