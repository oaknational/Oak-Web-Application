import OakError from "../../errors/OakError";

import verifyFirebaseToken from "./verifyFirebaseToken";

const testTokenValue = "token";
const testFirebaseUser = { uid: "123", email: "abc" };
const verifyIdTokenSpy = jest.fn(async () => testFirebaseUser);

jest.mock("../firebase", () => ({
  firebaseAdminAuth: {
    verifyIdToken: (...args: []) => verifyIdTokenSpy(...args),
  },
}));

describe("node-lib/auth/verifyFirebaseToken.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should call verifyIdToken with the token", async () => {
    await verifyFirebaseToken({ accessToken: testTokenValue });
    expect(verifyIdTokenSpy).toHaveBeenCalledWith(testTokenValue);
  });
  it("should throw the correct OakError if verifyIdToken fails", async () => {
    verifyIdTokenSpy.mockImplementationOnce(() =>
      Promise.reject(new Error("bad thing happened"))
    );
    await expect(
      async () => await verifyFirebaseToken({ accessToken: testTokenValue })
    ).rejects.toThrowError(new OakError({ code: "auth/token-error-unknown" }));
  });
});
