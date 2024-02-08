import { PortableTextComponentProps } from "@portabletext/react";
import { OakFlex } from "@oaknational/oak-components";

import { Video } from "@/common-lib/cms-types";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import Box from "@/components/SharedComponents/Box";

const PostVideo = (props: PortableTextComponentProps<Video>) => {
  if (!props.value) {
    return null;
  }

  return (
    <Box>
      {props.value && (
        <OakFlex $position={"relative"} $mt="space-between-xl">
          <CMSVideo video={props.value} location="blog" />
        </OakFlex>
      )}
    </Box>
  );
};

export default PostVideo;
