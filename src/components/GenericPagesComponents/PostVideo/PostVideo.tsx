import { PortableTextComponentProps } from "@portabletext/react";
import { OakBox, OakFlex } from "@oaknational/oak-components";

import { Video } from "@/common-lib/cms-types";
import CMSVideo from "@/components/SharedComponents/CMSVideo";

const PostVideo = (props: PortableTextComponentProps<Video>) => {
  if (!props.value) {
    return null;
  }

  return (
    <OakBox>
      {props.value && (
        <OakFlex $position={"relative"} $mt="space-between-xl">
          <CMSVideo video={props.value} location="blog" />
        </OakFlex>
      )}
    </OakBox>
  );
};

export default PostVideo;
