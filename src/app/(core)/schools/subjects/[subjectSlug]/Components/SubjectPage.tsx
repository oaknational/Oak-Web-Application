"use client";
import { OakBox } from "@oaknational/oak-components";

export function SubjectPage({ subjectSlug }: { subjectSlug: string }) {
  return (
    <OakBox $zIndex={"neutral"} $color={"text-primary"}>
      Subject page: {subjectSlug}
    </OakBox>
  );
}
