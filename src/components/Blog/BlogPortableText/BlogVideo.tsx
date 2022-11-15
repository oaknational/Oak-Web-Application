import { PortableTextComponentProps } from "@portabletext/react";

import { Video } from "../../../common-lib/cms-types";
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
          <CMSVideo video={props.value} location="blog" />
        </Flex>
      )}
    </Box>
  );
};

export default BlogVideo;
