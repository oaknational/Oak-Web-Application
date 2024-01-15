import { PortableTextComponentProps } from "@portabletext/react";

import { LandingPageSignUpForm } from "@/components/GenericPagesComponents/LandingPageSignUpForm";
import Flex from "@/components/SharedComponents/Flex";

type FormBlock = {
  title: string;
};

const PostForm = (props: PortableTextComponentProps<FormBlock>) => {
  if (!props.value) {
    return null;
  }

  const params = props.value;

  return (
    <Flex $mv={56}>
      <LandingPageSignUpForm formTitle={params.title} />
    </Flex>
  );
};

export default PostForm;
