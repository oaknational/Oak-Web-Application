import { jest } from "@jest/globals";
import "@testing-library/jest-dom/extend-expect";

// require("jest-fetch-mock").enableMocks();

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onIdTokenChanged: jest.fn(() => () => undefined),
  onAuthStateChanged: jest.fn(() => () => undefined),
  isSignInWithEmailLink: jest.fn(() => true),
  signInWithEmailLink: jest.fn(async () => ({
    user: { email: "test@thenational.academy" },
  })),
  sendSignInLinkToEmail: jest.fn(async () => undefined),
  signOut: jest.fn(async () => undefined),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));
