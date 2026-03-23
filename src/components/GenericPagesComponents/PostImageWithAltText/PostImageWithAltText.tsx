import { PortableTextComponentProps } from "@portabletext/react";

import { Image } from "../../../common-lib/cms-types";

import CMSImage from "@/components/SharedComponents/CMSImage";

const PostImageWithAltText = (
  props: PortableTextComponentProps<{ asset: Image["asset"] }>,
) => {
  if (!props.value) {
    return null;
  }

  return <CMSImage image={props.value} $mt={"spacing-48"} $mb={"spacing-48"} />;
};

export default PostImageWithAltText;
