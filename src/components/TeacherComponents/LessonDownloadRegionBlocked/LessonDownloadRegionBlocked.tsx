import { OakBox, OakHeading, OakLink, OakP } from "@oaknational/oak-components";
import Link from "next/link";

import { resolveOakHref } from "@/common-lib/urls";

export const LessonDownloadRegionBlocked = () => {
  return (
    <OakBox $maxWidth="all-spacing-22">
      <OakHeading tag="h1" $font="heading-4" $mb="space-between-m">
        Sorry, downloads for this lesson are not available in your country
      </OakHeading>
      <OakP $font="body-1">
        Some of our content is restricted to the UK due to copyright.
      </OakP>
      <OakP $font="body-1">
        If you believe this is an error and you're based in the UK, please{" "}
        <OakLink element={Link} href={resolveOakHref({ page: "contact" })}>
          contact us
        </OakLink>
        .
      </OakP>
    </OakBox>
  );
};
