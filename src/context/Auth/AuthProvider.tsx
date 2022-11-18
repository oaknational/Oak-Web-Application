import { useEffect, FC, useCallback, useMemo } from "react";
import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  getAuth as firebaseGetAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  isSignInWithEmailLink as firebaseIsSignInWithEmailLink,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  onIdTokenChanged as firebaseOnIdTokenChanged,
  sendSignInLinkToEmail as firebaseSendSignInLinkToEmail,
  signOut as firebaseSignOut,
} from "firebase/auth";

import useLocalStorage from "../../hooks/useLocalStorage";
import config from "../../config/browser";
import {
  LS_KEY_EMAIL_FOR_SIGN_IN,
  LS_KEY_USER,
} from "../../config/localStorageKeys";
import useApi from "../../browser-lib/api";
import { useBookmarksCache } from "../../context/Bookmarks";
import errorReporter from "../../common-lib/error-reporter";
import OakError from "../../errors/OakError";
import useStableCallback from "../../hooks/useStableCallback";

import useAccessToken from "./useAccessToken";
import authContext, { OakAuth, OakUser } from "./authContext";

const firebaseConfig: FirebaseOptions = {
  apiKey: config.get("firebaseApiKey"),
  authDomain: config.get("firebaseAuthDomain"),
  projectId: config.get("firebaseProjectId"),
  storageBucket: config.get("firebaseStorageBucket"),
  messagingSenderId: config.get("firebaseMessagingSenderId"),
  appId: config.get("firebaseAppId"),
};

initializeApp(firebaseConfig);

const reportError = errorReporter("useAuth");

const firebaseAuth = firebaseGetAuth();

/**
 * Proxying for zero-rating
 */
firebaseAuth.config.apiScheme = "https";
firebaseAuth.config.apiHost = config.get("firebaseConfigApiHost");
firebaseAuth.config.tokenApiHost = config.get("firebaseConfigTokenApiHost");

/**
 * @todo move this to src/config
 */
const getClientAppBaseUrl = () => {
  if (typeof window === "undefined") {
    throw new Error(
      "Cannot call 'getClientAppBaseUrl()' on server. Each deployment has multiple domains, so each server must be able to serve multiple client addresses"
    );
  }

  return window.location.origin;
};

export const getSignInCallbackUrl = () =>
  `${getClientAppBaseUrl()}/beta/sign-in/callback`;

export type AuthProviderValue = OakAuth;
export type AuthProviderProps = {
  children?: React.ReactNode;
  value?: Partial<AuthProviderValue>;
};
const AuthProvider: FC<AuthProviderProps> = ({
  children,
  value: propsValue,
}) => {
  const [, setBookmarks] = useBookmarksCache();
  const [userRaw, setUser] = useLocalStorage<OakUser | null>(LS_KEY_USER, null);
  const [, setAccessToken] = useAccessToken();
  const api = useApi();
  const apiGetOrCreateUser = api["/user"];
  const user: OakUser | null = useMemo(() => {
    if (!userRaw?.email || !userRaw?.id) {
      return null;
    }

    return { email: userRaw.email, id: userRaw.id };
  }, [userRaw?.email, userRaw?.id]);

  useEffect(() => {
    /**
     * @todo on load, check access key expired and get new one if necessary
     */
  }, []);

  // Reset any auth/user related state
  const resetAuthState = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setBookmarks([]);
  }, [setUser, setAccessToken, setBookmarks]);

  // Keep local access token in sync with firebase token
  useEffect(() => {
    const unsubscribe = firebaseOnIdTokenChanged(
      firebaseAuth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          return resetAuthState();
        } else {
          const accessToken = await firebaseUser.getIdToken();
          setAccessToken(accessToken);
        }
      }
    );

    return () => unsubscribe();
  }, [setAccessToken, resetAuthState]);

  // Keep local auth state in sync with firebase session
  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(
      firebaseAuth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          return resetAuthState();
        }

        if (!firebaseUser.email) {
          // shouldn't happen as all signups require email
          return resetAuthState();
        }

        try {
          const accessToken = await firebaseUser.getIdToken();
          setAccessToken(accessToken);
        } catch (error) {
          // @TODO error service
          return resetAuthState();
        }
      }
    );
    return () => unsubscribe();
  }, [resetAuthState, setAccessToken]);

  // Force refresh the token every 10 minutes
  /** @todo call getIdToken() before each request to ensure token valid */
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  // Send email to user containing a one-time magic link
  const signInWithEmail = useCallback(async (email: string) => {
    try {
      await firebaseSendSignInLinkToEmail(firebaseAuth, email, {
        url: getSignInCallbackUrl(),
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
  }, []);

  // Function to call at the callback url of the one-time magic link
  const signInWithEmailCallback = useStableCallback(async (email: string) => {
    if (!firebaseIsSignInWithEmailLink(firebaseAuth, window.location.href)) {
      throw new Error("Invalid sign in link");
    }
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.

    try {
      // The client SDK will parse the code from the link for you.
      const userCredential = await firebaseSignInWithEmailLink(
        firebaseAuth,
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
      reportError(error);
      resetAuthState();

      throw new Error("Invalid email or expired OTP");
    }
  });

  const signOut = useCallback(async () => {
    await firebaseSignOut(firebaseAuth);
  }, []);

  // Return the user object and firebaseAuth methods
  const value = {
    user,
    signOut,
    signInWithEmail,
    signInWithEmailCallback,
  };
  return (
    <authContext.Provider value={{ ...value, ...propsValue }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
