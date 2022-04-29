// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FirebaseError } from "../../../jest.setup.js";
import OakError from "../../errors/OakError";

import applyHasuraClaimsToFirebaseUser from "./applyHasuraClaimsToFirebaseUser";

const firebaseUid = "123";
const testOakUser = {
  id: "1",
  firebase_id: firebaseUid,
  email: "abc",
};
const setCustomUserClaimsSpy = jest.fn();

jest.mock("../firebase", () => ({
  firebaseAdminAuth: {
    setCustomUserClaims: (...args: []) => setCustomUserClaimsSpy(...args),
  },
  firebaseAdminDatabase: {
    ref: jest.fn(() => ({ set: jest.fn() })),
  },
}));

jest.mock("../graphql");

describe("node-lib/auth/applyHasuraClaimsToFirebaseUser.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should call setCustomUserCalims with the correct payload", async () => {
    await applyHasuraClaimsToFirebaseUser({ firebaseUid, user: testOakUser });
    expect(setCustomUserClaimsSpy).toHaveBeenCalledWith("123", {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-user-id": "1",
      },
    });
  });
  it("should throw the correct OakError if setCustomUserCalims fails", async () => {
    const originalError = new Error("bad thing happened");
    setCustomUserClaimsSpy.mockImplementationOnce(() =>
      Promise.reject(originalError)
    );
    await expect(
      async () =>
        await applyHasuraClaimsToFirebaseUser({
          firebaseUid,
          user: testOakUser,
        })
    ).rejects.toThrowError(
      new OakError({ code: "misc/unknown", originalError })
    );
  });
  it("should throw the correct OakError if setCustomUserCalims fails with a FirebaseError network-error", async () => {
    const originalError = new FirebaseError();
    originalError.code = "app/network-error";
    setCustomUserClaimsSpy.mockImplementationOnce(() =>
      Promise.reject(originalError)
    );
    await expect(
      async () =>
        await applyHasuraClaimsToFirebaseUser({
          firebaseUid,
          user: testOakUser,
        })
    ).rejects.toThrowError(
      new OakError({ code: "misc/network-error", originalError })
    );
  });
});
