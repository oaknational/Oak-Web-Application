import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Flex from "../../components/Flex";
import Layout from "../../components/Layout";
import { useUser } from "../../context/Auth";

const SignInSuccess: NextPage = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("success", user);
    if (!user) {
      router.replace("/sign-in", undefined, { shallow: true });
    }
  }, [user, router]);
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <Flex
        flexGrow={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <p data-testid="sign-in-success-message">
          Thanks for signing in! You can close this tab and head over the tab
          you just had open.
        </p>
      </Flex>
    </Layout>
  );
};

export default SignInSuccess;
