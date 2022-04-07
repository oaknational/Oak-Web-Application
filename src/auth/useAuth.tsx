// Adapted from https://usehooks.com/useAuth/
import { useEffect, useContext, createContext, FC } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onIdTokenChanged,
  sendSignInLinkToEmail,
  signOut,
} from "firebase/auth";

import useLocalStorage from "../hooks/useLocalStorage";
import config from "../config";
import { LS_KEY_EMAIL_FOR_SIGN_IN } from "../config/localStorageKeys";
import useApi from "../browser-lib/api";

import useAccessToken from "./useAccessToken";

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

export type OakUser = {
  email: string;
  id: number;
};

type OakAuth = {
  user: OakUser | null;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signInWithEmailCallback: () => Promise<void>;
};

export const authContext = createContext<OakAuth | null>(null);

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useLocalStorage<OakUser | null>("user", null);
  const [accessToken, setAccessToken] = useAccessToken();
  const api = useApi();
  const apiLogin = api["/login"];

  const onLogin = async () => {
    const oakUser = await apiLogin();
    setUser(oakUser);
  };

  useEffect(() => {
    if (accessToken) {
      // @TODO catch errors
      onLogin();
    }
  }, [accessToken]);

  const resetAuthState = () => {
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        return resetAuthState();
      } else {
        const token = await user.getIdToken();
        setAccessToken(token);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return resetAuthState();
      }

      if (!user.email) {
        // shouldn't happen as all signups require email
        return resetAuthState();
      }

      try {
        const accessToken = await user.getIdToken();
        setAccessToken(accessToken);
      } catch (error) {
        // @TODO error service
        return resetAuthState();
      }
    });
    return () => unsubscribe();
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  // Return the user object and auth methods
  const value = {
    user,
    signOut: async () => {
      await signOut(auth);
      resetAuthState();
    },
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
        const userCredential = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );
        // Clear email from storage.
        window.localStorage.removeItem(LS_KEY_EMAIL_FOR_SIGN_IN);

        const accessToken = await userCredential.user.getIdToken();
        setAccessToken(accessToken);
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
