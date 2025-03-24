import { FC } from "react";
import { OakLink, OakBox, OakSpan } from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { FontProps } from "@/styles/utils/typography";

type CopyrightNoticeProps = FontProps & {
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
        iconHeight="all-spacing-5"
        iconWidth="all-spacing-5"
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

const PostAlbCopyright = (
  props: FontProps & { openLinksExternally: boolean; copyrightYear: string },
) => {
  const { copyrightYear } = props;
  const year = new Date(copyrightYear).getFullYear();
  return (
    <OakBox $font="body-3" {...props}>
      This content is © Oak National Academy Limited ({year}), licensed on{" "}
      {props.openLinksExternally ? (
        <OakLink
          href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
          target={"_blank"}
          iconName="external"
          isTrailingIcon
          iconHeight="all-spacing-5"
          iconWidth="all-spacing-5"
          data-testid="external-link-icon"
          aria-label="Open Government Licence version 3.0 (opens in a new tab)"
        >
          Open Government Licence version 3.0
        </OakLink>
      ) : (
        <OakLink
          href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
          target={"_self"}
          aria-label="Open Government Licence version 3.0"
        >
          Open Government Licence version 3.0
        </OakLink>
      )}{" "}
      except where otherwise stated. See{" "}
      {props.openLinksExternally ? (
        <OakLink
          href={resolveOakHref({
            page: "legal",
            legalSlug: "terms-and-conditions",
          })}
          target={"_blank"}
          aria-label="Oak's terms & conditions (opens in a new tab)"
          iconName="external"
          isTrailingIcon
          iconHeight="all-spacing-5"
          iconWidth="all-spacing-5"
          data-testid="external-link-icon"
        >
          Oak's terms & conditions
        </OakLink>
      ) : (
        <OakLink
          href={resolveOakHref({
            page: "legal",
            legalSlug: "terms-and-conditions",
          })}
          aria-label="Oak's terms & conditions"
          target={"_self"}
        >
          Oak's terms & conditions
        </OakLink>
      )}{" "}
      (Collection 2).
    </OakBox>
  );
};

const CopyrightNotice: FC<CopyrightNoticeProps> = ({
  showPostAlbCopyright,
  openLinksExternally,
  copyrightYear,
  fullWidth,
  ...fontProps
}) => (
  <OakBox
    $maxWidth={fullWidth ? null : [null, "all-spacing-21", "all-spacing-21"]}
  >
    {showPostAlbCopyright ? (
      <PostAlbCopyright
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

export default CopyrightNotice;
