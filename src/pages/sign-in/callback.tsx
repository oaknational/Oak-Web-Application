import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import useAuth from "../../context/Auth/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";

const SignInCallback: NextPage = () => {
  const { signInWithEmailCallback } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const attemptSignInCallback = useCallback(async () => {
    try {
      await signInWithEmailCallback();

      router.replace("/sign-in/success", undefined, { shallow: true });
    } catch (error) {
      router.replace("/sign-in/error", undefined, { shallow: true });
    } finally {
      setLoading(false);
    }
  }, [router, signInWithEmailCallback]);

  useEffect(() => {
    attemptSignInCallback();
  }, [attemptSignInCallback]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <div>Thanks for signing in</div>;
};

export default SignInCallback;
