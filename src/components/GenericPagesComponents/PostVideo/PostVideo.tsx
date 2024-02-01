import { PortableTextComponentProps } from "@portabletext/react";

import { Video } from "@/common-lib/cms-types";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";

const PostVideo = (props: PortableTextComponentProps<Video>) => {
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

export default PostVideo;
