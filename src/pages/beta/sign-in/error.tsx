import { NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import Flex from "../../../components/Flex";
import AppLayout from "../../../components/AppLayout";
import OakLink from "../../../components/OakLink";

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
          <OakLink page="home" $isInline>
            Take me home.
          </OakLink>
        </p>
      </Flex>
    </AppLayout>
  );
};

export default SignInError;
