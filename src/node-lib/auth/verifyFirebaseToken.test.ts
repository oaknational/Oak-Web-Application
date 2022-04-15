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
  it.todo("should throw the correct OakError if verifyIdToken fails");
});
