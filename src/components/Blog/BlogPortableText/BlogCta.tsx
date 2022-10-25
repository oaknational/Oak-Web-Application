import { PortableTextComponentProps } from "@portabletext/react";

import { CTA } from "../../../node-lib/cms";
import { getCTAHref } from "../../../utils/portableText/resolveInternalHref";
import ButtonAsLink from "../../Button/ButtonAsLink";

const BlogCta = (props: PortableTextComponentProps<CTA>) => {
  if (!props.value) {
    return null;
  }
  const cta = props.value;

  return (
    <ButtonAsLink
      label={cta.label}
      href={getCTAHref(cta)}
      background={"teachersHighlight"}
    />
  );
};

export default BlogCta;
