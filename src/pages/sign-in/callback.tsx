import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import useAuth from "../../context/Auth/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";
import Layout from "../../components/Layout";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Flex from "../../components/Flex";
import { useUser } from "../../context/Auth";
import { LS_KEY_EMAIL_FOR_SIGN_IN } from "../../config/localStorageKeys";
import Input from "../../components/Input";
import Button from "../../components/Button";

const SignInCallback: NextPage = () => {
  const { signInWithEmailCallback } = useAuth();
  const [loading, setLoading] = useState(false);
  const emailFromLocalStorage =
    typeof window !== "undefined"
      ? window.localStorage.getItem(LS_KEY_EMAIL_FOR_SIGN_IN)
      : null;
  const [confirmedEmail, setConfirmedEmail] = useState(emailFromLocalStorage);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const user = useUser();

  const signInAndRedirect = useCallback(
    async (email: string) => {
      try {
        setLoading(true);
        await signInWithEmailCallback(email);
        console.log("callback success");

        router.replace("/sign-in/success", undefined, { shallow: true });
      } catch (error) {
        router.replace("/sign-in/error", undefined, { shallow: true });
        console.log("callback error", error);
      } finally {
        setLoading(false);
      }
    },
    [router, signInWithEmailCallback]
  );

  useEffect(() => {
    console.log("callback user", user);
    if (user) {
      // redirect here to /success
    }
  }, [user, router]);

  useEffect(() => {
    if (confirmedEmail) {
      signInAndRedirect(confirmedEmail);
    }
  }, [confirmedEmail, signInAndRedirect]);

  const confirmEmail = () => {
    setConfirmedEmail(email);
  };

  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        {!confirmedEmail && (
          <form onSubmit={confirmEmail}>
            <Input
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Button onClick={confirmEmail} label="Sign in" />
          </form>
        )}
        {loading ? <LoadingSpinner /> : <p>Thanks for signing in</p>}
      </Flex>
    </Layout>
  );
};

export default SignInCallback;
