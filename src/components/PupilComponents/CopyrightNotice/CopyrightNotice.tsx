import Link from "next/link";
import { OakLink, OakSpan } from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";

type CopyrightNoticeProps = {
  isLegacyLicense: boolean;
};

/**
 * Displays the copyright notice for a lesson.
 * `isLegacyLicense` indicates whether the lesson is using the current or old license.
 */
export const CopyrightNotice = ({ isLegacyLicense }: CopyrightNoticeProps) => {
  if (isLegacyLicense) {
    return (
      <OakSpan $font="body-4" $color="text-subdued">
        This content is made available by Oak National Academy Limited and its
        partners and licensed under{" "}
        <OakLink
          element={Link}
          href={resolveOakHref({
            page: "legal",
            legalSlug: "terms-and-conditions",
          })}
        >
          Oak's terms & conditions
        </OakLink>{" "}
        (Collection 1), except where otherwise stated.
      </OakSpan>
    );
  }

  return (
    <OakSpan $font="body-4" $color="text-subdued">
      This content is © Oak National Academy Limited (2023), licensed on{" "}
      <OakLink
        href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
        rel="external"
      >
        Open Government Licence version 3.0
      </OakLink>{" "}
      except where otherwise stated. See{" "}
      <OakLink
        element={Link}
        href={resolveOakHref({
          page: "legal",
          legalSlug: "terms-and-conditions",
        })}
      >
        Oak's terms & conditions
      </OakLink>{" "}
      (Collection 2).
    </OakSpan>
  );
};
