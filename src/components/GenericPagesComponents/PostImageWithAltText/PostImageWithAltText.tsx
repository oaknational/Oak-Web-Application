import { PortableTextComponentProps } from "@portabletext/react";

import { Image } from "../../../common-lib/cms-types";

import CMSImage from "@/components/SharedComponents/CMSImage";

const PostImageWithAltText = (
  props: PortableTextComponentProps<{ asset: Image["asset"] }>,
) => {
  if (!props.value) {
    return null;
  }

  return <CMSImage image={props.value} $mt={24} $mb={24} />;
};

export default PostImageWithAltText;
