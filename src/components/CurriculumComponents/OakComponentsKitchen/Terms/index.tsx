import { OakLink, OakP } from "@oaknational/oak-components";
import { ComponentProps } from "react";

import { resolveOakHref } from "@/common-lib/urls";

const Link = (props: ComponentProps<typeof OakLink>) => {
  const isExternal = props.rel === "external";
  const additionalProps = isExternal
    ? ({
        target: "_blank",
      } as const)
    : {};
  return (
    <OakLink {...props} {...additionalProps} style={{ display: "inline" }}>
      {props.children}
    </OakLink>
  );
};

export default function Terms() {
  return (
    <OakP $font={["body-3"]}>
      This content is © Oak National Academy (2023), licensed on{" "}
      <Link
        target="_blank"
        rel="external"
        href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
      >
        Open Government Licence version 3.0
      </Link>{" "}
      except where otherwise stated. See{" "}
      <Link
        rel="external"
        href={resolveOakHref({
          page: "legal",
          legalSlug: "terms-and-conditions",
        })}
      >
        Oak's terms and conditions
      </Link>
      .
    </OakP>
  );
}
