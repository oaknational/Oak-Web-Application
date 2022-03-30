import { NextPage } from "next";

const SignInSuccess: NextPage = () => {
  return (
    <div data-testid="sign-in-success-message">
      Thanks for signing in! You can close this tab and head over the tab you just had
      open.
    </div>
  );
};

export default SignInSuccess;
