import { NextPage } from "next";
import Link from "next/link";

import { DEFAULT_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import Flex from "../../../components/Flex";
import Layout from "../../../components/Layout";

const SignInError: NextPage = () => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <Flex
        flexGrow={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <p data-testid="sign-in-error-message">
          There was an error signing you in.{" "}
          <Link href="/">
            <a>Take me home.</a>
          </Link>
        </p>
      </Flex>
    </Layout>
  );
};

export default SignInError;
