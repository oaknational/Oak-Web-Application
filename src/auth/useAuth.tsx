// Adapted from https://usehooks.com/useAuth/
import { useEffect, useContext, createContext, FC } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  signOut,
} from "firebase/auth";

import useLocalStorage from "../hooks/useLocalStorage";
import config from "../config";
import { LS_KEY_EMAIL_FOR_SIGN_IN } from "../config/localStorageKeys";

const firebaseConfig = {
  apiKey: config.get("firebaseApiKey"),
  authDomain: config.get("firebaseAuthDomain"),
  projectId: config.get("firebaseProjectId"),
  storageBucket: config.get("firebaseStorageBucket"),
  messagingSenderId: config.get("firebaseMessagingSenderId"),
  appId: config.get("firebaseAppId"),
};

const SIGN_IN_CALLBACK_URL = `${config.get(
  "clientAppBaseUrl"
)}/sign-in/callback`;

initializeApp(firebaseConfig);

const auth = getAuth();

type OakUser = {
  email: string;
};

type OakAuth = {
  user: OakUser | null;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signInWithEmailCallback: () => Promise<OakUser>;
};
const firebaseUserToOakUser = ({ email }: FirebaseUser): OakUser => {
  if (!email) {
    // @TODO is this a plausible case? some openid/oauth2 providers may not use email
    throw new Error("User has no email");
  }
  return {
    email,
  };
};
const authContext = createContext<OakAuth | null>(null);
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useLocalStorage<OakUser | null>("user", null);
  console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged", user);

      if (user) {
        setUser(firebaseUserToOakUser(user));
      } else {
        setUser(null);
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  // Return the user object and auth methods
  const value = {
    user,
    signOut: () => signOut(auth).then(() => setUser(null)),
    signInWithEmail: async (email: string) => {
      try {
        await sendSignInLinkToEmail(auth, email, {
          url: SIGN_IN_CALLBACK_URL,
          // This must be true.
          handleCodeInApp: true,
        });
        window.localStorage.setItem(LS_KEY_EMAIL_FOR_SIGN_IN, email);
      } catch (error) {
        // @TODO error service
        // const errorCode = error.code;
        // const errorMessage = error.message;
        console.log(error);
      }
    },
    signInWithEmailCallback: async () => {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        throw new Error("Invalid sign in link");
      }
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem(LS_KEY_EMAIL_FOR_SIGN_IN);
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email =
          window.prompt("Please provide your email for confirmation") || "";
      }

      try {
        // The client SDK will parse the code from the link for you.
        const response = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );
        // Clear email from storage.
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser

        window.localStorage.removeItem(LS_KEY_EMAIL_FOR_SIGN_IN);

        const oakUser = firebaseUserToOakUser(response.user);
        setUser(oakUser);
        return oakUser;
      } catch (error) {
        // @TODO error service
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        console.log(error);
        throw new Error("Invalid email or expired OTP");
      }
    },
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

const useAuth = () => {
  const auth = useContext(authContext);
  if (!auth) {
    throw new Error("useAuth called outside of AuthProvider");
  }
  return auth;
};

export default useAuth;
