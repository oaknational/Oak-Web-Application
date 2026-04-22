import { FC } from "react";
import { OakLink, OakBox, OakSpan } from "@oaknational/oak-components";

import CopyrightLicence from "../CopyrightLicence/CopyrightLicence";

import { resolveOakHref } from "@/common-lib/urls";
import { FontProps } from "@/styles/utils/typography";

type OglCopyrightNoticeProps = FontProps & {
  showPostAlbCopyright: boolean;
  openLinksExternally: boolean;
  copyrightYear: string;
  fullWidth?: boolean;
};

const PreAlbCopyright = (
  props: FontProps & { openLinksExternally: boolean },
) => (
  <OakSpan $font="body-3" {...props}>
    This content is made available by Oak National Academy Limited and its
    partners and licensed under Oak’s{" "}
    {props.openLinksExternally ? (
      <OakLink
        href={resolveOakHref({
          page: "legal",
          legalSlug: "terms-and-conditions",
        })}
        target="_blank"
        aria-label="Terms and conditions (opens in a new tab)"
        iconName="external"
        isTrailingIcon
        iconHeight="spacing-20"
        iconWidth="spacing-20"
        data-testid="external-link-icon"
      >
        terms &amp; conditions
      </OakLink>
    ) : (
      <OakLink
        href={resolveOakHref({
          page: "legal",
          legalSlug: "terms-and-conditions",
        })}
        target={"_self"}
        aria-label="Terms and conditions"
      >
        terms &amp; conditions
      </OakLink>
    )}{" "}
    (Collection 1), except where otherwise stated.
  </OakSpan>
);

const OglCopyrightNotice: FC<OglCopyrightNoticeProps> = ({
  showPostAlbCopyright,
  openLinksExternally,
  copyrightYear,
  fullWidth,
  ...fontProps
}) => (
  <OakBox $maxWidth={fullWidth ? null : [null, "spacing-480", "spacing-480"]}>
    {showPostAlbCopyright ? (
      <CopyrightLicence
        {...fontProps}
        copyrightYear={copyrightYear}
        openLinksExternally={openLinksExternally}
      />
    ) : (
      <PreAlbCopyright
        {...fontProps}
        openLinksExternally={openLinksExternally}
      />
    )}
  </OakBox>
);

export default OglCopyrightNotice;
