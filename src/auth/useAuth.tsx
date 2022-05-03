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
import {
  LS_KEY_EMAIL_FOR_SIGN_IN,
  LS_KEY_USER,
} from "../config/localStorageKeys";
import useApi from "../browser-lib/api";
import { useBookmarksCache } from "../hooks/useBookmarks";
import createErrorHandler from "../common-lib/error-handler";
import OakError from "../errors/OakError";

import useAccessToken from "./useAccessToken";

const firebaseConfig = {
  apiKey: config.get("firebaseApiKey"),
  authDomain: config.get("firebaseAuthDomain"),
  projectId: config.get("firebaseProjectId"),
  storageBucket: config.get("firebaseStorageBucket"),
  messagingSenderId: config.get("firebaseMessagingSenderId"),
  appId: config.get("firebaseAppId"),
};

initializeApp(firebaseConfig);

const errorHandler = createErrorHandler("useAuth");

const auth = getAuth();

/**
 * @todo we should be able to pick this up from the environment
 * but there was an issue on one of the deployment so it needs
 * a bit further investigation
 */
const clientAppBaseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : config.get("clientAppBaseUrl");

export const SIGN_IN_CALLBACK_URL = `${clientAppBaseUrl}/sign-in/callback`;

export type UserId = string;

export type OakUser = {
  email: string;
  id: UserId;
};

export type OakAuth = {
  user: OakUser | null;
  // Convenience property, and primative, so useful in hook dependency arrays
  isLoggedIn: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signInWithEmailCallback: () => Promise<void>;
};

export const authContext = createContext<OakAuth | null>(null);

export const AuthProvider: FC = ({ children }) => {
  const [, setBookmarks] = useBookmarksCache();
  const [user, setUser] = useLocalStorage<OakUser | null>(LS_KEY_USER, null);
  const isLoggedIn = Boolean(user);
  const [, setAccessToken] = useAccessToken();
  const api = useApi();
  const apiGetOrCreateUser = api["/user"];

  useEffect(() => {
    /**
     * @todo on load, check access key expired and get new one if necessary
     */
  }, []);

  const resetAuthState = () => {
    setUser(null);
    setAccessToken(null);
    setBookmarks([]);
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
    isLoggedIn,
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
        throw new OakError({
          code: "auth/send-sign-in-link",
          originalError: error,
        });
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
        const oakUser = await apiGetOrCreateUser({ accessToken });
        const accessTokenWithNewClaims = await userCredential.user.getIdToken(
          true
        );
        setAccessToken(accessTokenWithNewClaims);
        setUser(oakUser);
      } catch (error) {
        /**
         * @todo check if error for code/detail, throw OakError
         */
        errorHandler(error);
        resetAuthState();

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
