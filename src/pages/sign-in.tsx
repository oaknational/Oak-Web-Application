import { NextPage } from "next";

import Layout from "../components/Layout";
import SignIn from "../components/SignIn";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Flex from "../components/Flex";

const SignInPage: NextPage = () => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} isApp={true}>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        <SignIn />
      </Flex>
    </Layout>
  );
};

export default SignInPage;
