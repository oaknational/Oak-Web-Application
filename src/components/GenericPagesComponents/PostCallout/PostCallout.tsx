import { PortableTextComponentProps } from "@portabletext/react";
import { OakP } from "@oaknational/oak-components";

import { PortableTextJSON } from "@/common-lib/cms-types";
import Flex from "@/components/SharedComponents/Flex";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

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
      $background="lemon50"
    >
      <PortableTextWithDefaults
        value={props.value.body}
        components={{
          block: {
            sectionHeading: (props) => {
              return <OakP $font={"heading-light-5"}>{props.children}</OakP>;
            },
          },
        }}
      />
    </Flex>
  );
};

export default PostCallout;
