"use client";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";

export const EYFSHeader = ({ subjectTitle }: { subjectTitle: string }) => {
  return (
    <OakGrid $rg={"spacing-24"}>
      <OakGridArea $colSpan={[12, 10, 12]}>
        <OakHeading tag="h1" $font={"heading-1"}>
          EYFS {subjectTitle}
        </OakHeading>
      </OakGridArea>
      <OakGridArea $colSpan={[12, 10, 7]}>
        <OakP $font={"body-2"}>
          These resources were created and used by parents during the pandemic.
          Teachers have since used them for lesson planning inspiration. We’re
          redeveloping our reception resources to better support day-to-day in
          class teaching and workload, replacing the resources shown here.{" "}
          <OakLink
            href={resolveOakHref({
              page: "blog-single",
              blogSlug:
                "reimagining-oak-s-reception-resources-for-today-s-classrooms",
            })}
          >
            This blog
          </OakLink>{" "}
          explains more.
        </OakP>
      </OakGridArea>
    </OakGrid>
  );
};
