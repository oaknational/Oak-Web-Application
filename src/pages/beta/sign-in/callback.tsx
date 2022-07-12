import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import useAuth from "../../../context/Auth/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Layout from "../../../components/Layout";
import { DEFAULT_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import Flex from "../../../components/Flex";
import { useUser } from "../../../context/Auth";
import { LS_KEY_EMAIL_FOR_SIGN_IN } from "../../../config/localStorageKeys";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useStableCallback from "../../../hooks/useStableCallback";

const Form = styled.form`
  width: 100%;
  max-width: 450px;
`;

const SignInCallback: NextPage = () => {
  const { signInWithEmailCallback } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailFromLocalStorage =
    typeof window !== "undefined"
      ? window.localStorage.getItem(LS_KEY_EMAIL_FOR_SIGN_IN)
      : null;
  const [confirmedEmail, setConfirmedEmail] = useState(emailFromLocalStorage);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const user = useUser();

  const signInAndRedirect = useStableCallback(async (email: string) => {
    try {
      setLoading(true);
      await signInWithEmailCallback(email);
    } catch (error) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (user) {
      router.replace("/beta/sign-in/success", undefined, { shallow: true });
    }
  }, [user, router]);

  useEffect(() => {
    if (error) {
      router.replace("/beta/sign-in/error", undefined, { shallow: true });
    }
  }, [error, router]);

  useEffect(() => {
    if (confirmedEmail) {
      signInAndRedirect(confirmedEmail);
    }
  }, [confirmedEmail, signInAndRedirect]);

  const confirmEmail = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
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
          <Form onSubmit={confirmEmail}>
            <Flex>
              <Input
                id="sign-in-callback-email-inptu"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Button
                data-testid="callback-signin-button"
                onClick={confirmEmail}
                label="Sign in"
                ml={8}
              />
            </Flex>
          </Form>
        )}
        {loading && <LoadingSpinner />}
      </Flex>
    </Layout>
  );
};

export default SignInCallback;
