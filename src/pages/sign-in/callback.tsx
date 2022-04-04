import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import useAuth from "../../auth/useAuth";

const SignInCallback: NextPage = () => {
  const { signInWithEmailCallback } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const attemptSignInCallback = async () => {
    try {
      const user = await signInWithEmailCallback();
      console.log(user);

      router.replace("/sign-in/success", undefined, { shallow: true });
    } catch (error) {
      setError("An error occurred");
      router.replace("/sign-in/error", undefined, { shallow: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    attemptSignInCallback();
  }, []);

  console.log({ loading, error });

  return <div>Thanks for signing in</div>;
};

export default SignInCallback;
