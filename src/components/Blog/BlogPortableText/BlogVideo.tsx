import { PortableTextComponentProps } from "@portabletext/react";

import { Video } from "../../../node-lib/cms";
import Box from "../../Box";
import CMSVideo from "../../CMSVideo";
import Flex from "../../Flex";

const BlogVideo = (props: PortableTextComponentProps<Video>) => {
  if (!props.value) {
    return null;
  }

  return (
    <Box>
      {props.value && (
        <Flex $position={"relative"} $mt={56}>
          <CMSVideo video={props.value} />
        </Flex>
      )}
    </Box>
  );
};

export default BlogVideo;
