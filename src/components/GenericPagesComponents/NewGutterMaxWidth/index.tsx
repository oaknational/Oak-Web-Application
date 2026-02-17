import { OakBox } from "@oaknational/oak-components";
import { ReactNode } from "react";

export function NewGutterMaxWidth({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <OakBox
      $maxWidth={"spacing-1280"}
      $mh={"auto"}
      $ph={["spacing-20", "spacing-40"]}
    >
      {children}
    </OakBox>
  );
}
