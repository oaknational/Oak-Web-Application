"use client";
import { OakBox, OakLink } from "@oaknational/oak-components";

export function SchoolsPage() {
  return (
    <OakBox $zIndex={"neutral"} $color={"text-primary"}>
      Schools page: <OakLink href="/schools/subjects/english">English</OakLink>,{" "}
      <OakLink href="/schools/subjects/maths">Maths</OakLink>
    </OakBox>
  );
}
