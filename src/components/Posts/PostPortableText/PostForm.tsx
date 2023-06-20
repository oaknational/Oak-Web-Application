import { PortableTextComponentProps } from "@portabletext/react";

import Flex from "../../Flex";
import { SignUpForm } from "../../pages/LandingPages/SignUpForm";

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
      <SignUpForm formTitle={params.title} />
    </Flex>
  );
};

export default PostForm;
