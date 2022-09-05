import { NextPage } from "next";

import AppLayout from "../../../components/AppLayout";
import SignIn from "../../../components/SignIn";
import { DEFAULT_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import Flex from "../../../components/Flex";

const SignInPage: NextPage = () => {
  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS}>
      <Flex
        $flexDirection="column"
        $justifyContent="center"
        $alignItems="center"
        $flexGrow={1}
      >
        <SignIn />
      </Flex>
    </AppLayout>
  );
};

export default SignInPage;
