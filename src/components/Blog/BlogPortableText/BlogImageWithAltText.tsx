import { PortableTextComponentProps } from "@portabletext/react";

import { Image } from "../../../node-lib/cms";
import CMSImage from "../../CMSImage";

const BlogImageWithAltText = (
  props: PortableTextComponentProps<{ asset: Image["asset"] }>
) => {
  if (!props.value) {
    return null;
  }
  return <CMSImage image={props.value} $mt={80} $mb={64} />;
};

export default BlogImageWithAltText;
