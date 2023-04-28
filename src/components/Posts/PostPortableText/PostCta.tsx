import { PortableTextComponentProps } from "@portabletext/react";

import { CTA } from "../../../common-lib/cms-types";
import { getLinkHref } from "../../../utils/portableText/resolveInternalHref";
import ButtonAsLink from "../../Button/ButtonAsLink";

const PostCta = (props: PortableTextComponentProps<CTA>) => {
  if (!props.value) {
    return null;
  }
  const cta = props.value;

  return (
    <ButtonAsLink
      page={null}
      label={cta.label}
      href={getLinkHref(cta)}
      background={"teachersHighlight"}
    />
  );
};

export default PostCta;
