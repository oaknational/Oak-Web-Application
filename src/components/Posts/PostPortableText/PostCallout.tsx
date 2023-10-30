import { PortableTextComponentProps } from "@portabletext/react";

import { PortableTextJSON } from "@/common-lib/cms-types";
import Flex from "@/components/Flex";
import { P } from "@/components/Typography";
import { PortableTextWithDefaults } from "@/components/PortableText";

const PostCallout = (
  props: PortableTextComponentProps<{ body: PortableTextJSON }>,
) => {
  if (!props.value?.body) {
    return null;
  }

  return (
    <Flex
      $flexDirection={"column"}
      $mt={56}
      $pv={24}
      $ph={16}
      $background="teachersPastelYellow"
    >
      <PortableTextWithDefaults
        value={props.value.body}
        components={{
          block: {
            sectionHeading: (props) => {
              return <P $font={"heading-light-5"}>{props.children}</P>;
            },
          },
        }}
      />
    </Flex>
  );
};

export default PostCallout;
