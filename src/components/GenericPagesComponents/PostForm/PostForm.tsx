import { PortableTextComponentProps } from "@portabletext/react";
import { OakFlex } from "@oaknational/oak-components";

import { LandingPageSignUpForm } from "@/components/GenericPagesComponents/LandingPageSignUpForm";

type FormBlock = {
  title: string;
};

const PostForm = (props: PortableTextComponentProps<FormBlock>) => {
  if (!props.value) {
    return null;
  }

  const params = props.value;

  return (
    <OakFlex $mv="spacing-56">
      <LandingPageSignUpForm formTitle={params.title} dontDescribe={true} />
    </OakFlex>
  );
};

export default PostForm;
