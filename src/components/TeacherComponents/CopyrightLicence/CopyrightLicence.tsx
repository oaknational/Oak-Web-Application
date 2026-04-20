import { OakBox, OakLink } from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { FontProps } from "@/styles/utils/typography";

const CopyrightLicence = (
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
          iconHeight="spacing-20"
          iconWidth="spacing-20"
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
          iconHeight="spacing-20"
          iconWidth="spacing-20"
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

export default CopyrightLicence;
