"use client";
import { OakFlex, OakHeading } from "@oaknational/oak-components";

export const EYFSHeader = ({ subjectTitle }: { subjectTitle: string }) => {
  return (
    <OakFlex
      $width={["100%", "spacing-640", "100%"]}
      $flexDirection={"column"}
      $gap={"spacing-24"}
    >
      <OakHeading tag="h1" $font={"heading-1"}>
        EYFS {subjectTitle}
      </OakHeading>
    </OakFlex>
  );
};
