import { PortableTextComponentProps } from "@portabletext/react";
import { OakP, OakFlex } from "@oaknational/oak-components";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const PostCallout = (
  props: PortableTextComponentProps<{ body: PortableTextJSON }>,
) => {
  if (!props.value?.body) {
    return null;
  }

  return (
    <OakFlex
      $flexDirection={"column"}
      $mt="spacing-56"
      $pv="spacing-24"
      $ph="spacing-16"
      $background="bg-decorative5-subdued"
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
    </OakFlex>
  );
};

export default PostCallout;
