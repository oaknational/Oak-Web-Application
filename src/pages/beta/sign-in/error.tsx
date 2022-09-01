import { NextPage } from "next";
import Link from "next/link";

import { DEFAULT_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import Flex from "../../../components/Flex";
import AppLayout from "../../../components/AppLayout";

const SignInError: NextPage = () => {
  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} headerVariant="app">
      <Flex
        $flexGrow={1}
        $flexDirection="column"
        $alignItems="center"
        $justifyContent="center"
      >
        <p data-testid="sign-in-error-message">
          There was an error signing you in.{" "}
          <Link href="/">
            <a>Take me home.</a>
          </Link>
        </p>
      </Flex>
    </AppLayout>
  );
};

export default SignInError;
