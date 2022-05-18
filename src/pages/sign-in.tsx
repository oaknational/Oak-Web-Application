import { NextPage } from "next";
import { useEffect, useState } from "react";

import useAuth from "../context/Auth/useAuth";
import Layout from "../components/Layout";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";

type SignInStep = "NOT_ASKED" | "LINK_REQUESTED";

const SignIn = () => {
  const [step, setStep] = useState<SignInStep>("NOT_ASKED");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { user, signInWithEmail, signOut } = useAuth();
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

  const requestMagicLink = async () => {
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
      setError("Sorry that didn't work");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <>
        You are signed in as {user.email}
        <button onClick={signOut}>Sign out</button>
      </>
    );
  }

  const emailInputId = "email-input-id";

  if (step === "NOT_ASKED") {
    return (
      <>
        <label htmlFor={emailInputId}>Email</label>
        <input
          id={emailInputId}
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="sign-in-email-input"
        />
        <button onClick={requestMagicLink} disabled={loading}>
          Sign up/ sign in
        </button>
        <br />
        <p style={{ color: "red" }}>{error}</p>
      </>
    );
  }

  if (step === "LINK_REQUESTED") {
    return (
      <>
        <p>We sent a link to {email}.</p>
        <button onClick={reset}>Go back</button>
      </>
    );
  }

  // Should never happen ... error service?
  return null;
};

const SignInPage: NextPage = () => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <SignIn />
    </Layout>
  );
};

export default SignInPage;
