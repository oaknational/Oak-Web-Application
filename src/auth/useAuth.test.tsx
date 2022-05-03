import { renderHook, act } from "@testing-library/react-hooks";

import {
  LS_KEY_ACCESS_TOKEN,
  LS_KEY_EMAIL_FOR_SIGN_IN,
  LS_KEY_USER,
} from "../config/localStorageKeys";

import useAuth, { AuthProvider, getSignInCallbackUrl } from "./useAuth";

const testUser = { id: "1", email: "test email", firebaseUid: "123" };
const testToken = "test token";

class LocalStorageMock {
  store: Record<string, unknown> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: unknown) {
    this.store[key] = value + "";
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

const getLocalStorageUser = () =>
  JSON.parse(window.localStorage.getItem(LS_KEY_USER) || "");
const getLocalStorageAccessToken = () =>
  JSON.parse(window.localStorage.getItem(LS_KEY_ACCESS_TOKEN) || "");
const getLocalStorageEmail = () =>
  window.localStorage.getItem(LS_KEY_EMAIL_FOR_SIGN_IN);

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});

let triggerIdTokenChange: (user: typeof testUser | null) => void;
const idTokenChanged = () =>
  new Promise((resolve) => {
    triggerIdTokenChange = resolve;
  });

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ config: {} })),
  onAuthStateChanged: jest.fn(),
  isSignInWithEmailLink: jest.fn(() => true),
  signInWithEmailLink: jest.fn(() => ({
    user: { getIdToken: () => Promise.resolve(testToken) },
  })),
  onIdTokenChanged: jest.fn(async (auth, callback) => {
    const user = await idTokenChanged();
    callback(user);
  }),
  sendSignInLinkToEmail: jest.fn(),
  signOut: jest.fn(),
}));
const apiPostUserMock = jest.fn(() => Promise.resolve(testUser));
jest.mock("../browser-lib/api", () => ({
  __esModule: true,
  default: () => ({
    "/user": (...args: []) => apiPostUserMock(...args),
  }),
}));
const errorHandlerMock = jest.fn();
jest.mock("../common-lib/error-handler", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      errorHandlerMock(...args),
}));

const windowSpy = jest.spyOn(global, "window", "get");

window.prompt = jest.fn(() => testUser.email);

describe("auth/useAuth.tsx", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    window.localStorage.clear();
  });
  it("should set config.apiHost and config.tokenApiHost from env", async () => {
    const firebaseAuthConfig = {
      apiHost: "",
      tokenApiHost: "",
    };
    jest.mock("firebase/auth", () => ({
      getAuth: jest.fn(() => ({ config: firebaseAuthConfig })),
      onAuthStateChanged: jest.fn(),
      isSignInWithEmailLink: jest.fn(() => true),
      signInWithEmailLink: jest.fn(() => ({
        user: { getIdToken: () => Promise.resolve(testToken) },
      })),
      onIdTokenChanged: jest.fn(async (auth, callback) => {
        const user = await idTokenChanged();
        callback(user);
      }),
      sendSignInLinkToEmail: jest.fn(),
      signOut: jest.fn(),
    }));
    const { default: useAuth, AuthProvider } = await import("./useAuth");

    renderHook(useAuth, { wrapper: AuthProvider });
    expect(firebaseAuthConfig.apiHost).toBe(
      process.env.NEXT_PUBLIC_FIREBASE_API_HOST
    );
    expect(firebaseAuthConfig.tokenApiHost).toBe(
      process.env.NEXT_PUBLIC_FIREBASE_TOKEN_API_HOST
    );
  });
  it("should default user to null", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    const { user } = result.current;
    expect(user).toBeNull();
  });
  it("should set email on local storage when email sent", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await result.current.signInWithEmail("test email");
    expect(getLocalStorageEmail()).toBe("test email");
  });
  it("should remove email from local storage on sign in", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    window.localStorage.setItem(LS_KEY_EMAIL_FOR_SIGN_IN, "test email");
    await act(async () => {
      await result.current.signInWithEmailCallback();
    });
    expect(getLocalStorageEmail()).toBeNull();
  });
  it("should set user state on sign in", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await act(async () => {
      await result.current.signInWithEmailCallback();
    });
    expect(getLocalStorageUser()).toEqual(testUser);
  });
  it("should set accessToken state on sign in", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await act(async () => {
      await result.current.signInWithEmailCallback();
    });
    expect(getLocalStorageAccessToken()).toEqual(testToken);
  });
  it("should reset state and clear local storage on sign out", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await act(async () => {
      await result.current.signInWithEmailCallback();
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(getLocalStorageAccessToken()).toBeNull();
    expect(getLocalStorageUser()).toBeNull();
  });
  it("should reset state and clear local storage when firebase tells it to log out", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await act(async () => {
      triggerIdTokenChange(null);
    });

    expect(result.current.user).toBeNull();
    expect(getLocalStorageAccessToken()).toBeNull();
    expect(getLocalStorageUser()).toBeNull();
  });
  it("should have the correct sign in callback url on client-side", async () => {
    expect(getSignInCallbackUrl()).toEqual("http://localhost/sign-in/callback");
  });
  it("should throw if getSignInCallbackUrl() called on server-side", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    windowSpy.mockImplementationOnce(() => undefined);

    expect(getSignInCallbackUrl).toThrow();
  });
  it("should handle error if POST /user route fails on login", async () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    apiPostUserMock.mockImplementationOnce(() =>
      Promise.reject("something bad")
    );
    await act(async () => {
      try {
        await result.current.signInWithEmailCallback();
      } catch (error) {
        // catching exception so test doesn't blow up
      }
    });

    expect(errorHandlerMock).toHaveBeenCalledWith("something bad");
  });
});
