import { PortableTextComponentProps } from "@portabletext/react";

import { Image } from "../../../common-lib/cms-types";
import CMSImage from "../../CMSImage";

const PostImageWithAltText = (
  props: PortableTextComponentProps<{ asset: Image["asset"] }>
) => {
  if (!props.value) {
    return null;
  }

  return <CMSImage image={props.value} $mt={80} $mb={64} />;
};

export default PostImageWithAltText;
