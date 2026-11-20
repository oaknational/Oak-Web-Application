"use client";
import { OakBox } from "@oaknational/oak-components";

export type SubjectPageProps = {
  subjectSlug: string;
};
export function SubjectPage({ subjectSlug }: Readonly<SubjectPageProps>) {
  return (
    <OakBox $zIndex={"neutral"} $color={"text-primary"}>
      Subject page: {subjectSlug}
    </OakBox>
  );
}
