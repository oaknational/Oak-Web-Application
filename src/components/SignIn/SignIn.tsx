import { FC, FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import { useAuth } from "../../context/Auth";
import Button from "../Button";
import Flex from "../Flex";
import Input from "../Input";
import UnstyledButton from "../UnstyledButton";

type SignInStep = "NOT_ASKED" | "LINK_REQUESTED";

const SignInForm = styled.form`
  width: 100%;
  max-width: 450px;
`;

const SignIn: FC = () => {
  const [step, setStep] = useState<SignInStep>("NOT_ASKED");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { user, signInWithEmail } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      // On logout reset
      setStep("NOT_ASKED");
    }
  }, [user]);

  const reset = () => {
    setStep("NOT_ASKED");
    setEmail("");
  };

  const requestMagicLink = async (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    console.log("sign in start");
    setError("");
    if (!email) {
      return setError("Email invalid");
    }
    setLoading(true);
    try {
      await signInWithEmail(email);
      setStep("LINK_REQUESTED");
      console.log("magic link in");
    } catch (error) {
      // set error
      console.log("error signing in", error);
      setError("Sorry, that didn't work");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <>You are signed in as {user.email}</>;
  }

  const emailInputId = "email-input-id";

  if (step === "NOT_ASKED") {
    return (
      <SignInForm onSubmit={requestMagicLink}>
        <Flex alignItems="end">
          <Flex flexDirection="column" flexGrow={1}>
            <label htmlFor={emailInputId}>Email</label>
            <Input
              id={emailInputId}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="sign-in-email-input"
            />
          </Flex>
          <Button
            onClick={requestMagicLink}
            ml={8}
            label="Sign in"
            htmlButtonProps={{
              disabled: loading,
            }}
          />
        </Flex>
        <p style={{ color: "red", position: "absolute" }}>{error}</p>
      </SignInForm>
    );
  }

  if (step === "LINK_REQUESTED") {
    return (
      <p>
        We sent a link to {email}.<br />
        Didn't get an email?{" "}
        <UnstyledButton onClick={reset}>Go back</UnstyledButton>.
      </p>
    );
  }

  // Should never happen ... error service?
  return null;
};

export default SignIn;
