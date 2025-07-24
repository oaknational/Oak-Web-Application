import { PortableTextComponentProps } from "@portabletext/react";
import { OakBox, OakPrimaryButton } from "@oaknational/oak-components";

import { CTA } from "../../../common-lib/cms-types";
import { getLinkHref } from "../../../utils/portableText/resolveInternalHref";

const PostCta = (props: PortableTextComponentProps<CTA>) => {
  if (!props.value) {
    return null;
  }
  const cta = props.value;

  return (
    <OakBox $mt="space-between-s">
      <OakPrimaryButton
        element="a"
        href={getLinkHref(cta)}
        // background={"blue"}
      >
        {cta.label}
      </OakPrimaryButton>
    </OakBox>
  );
};

export default PostCta;
