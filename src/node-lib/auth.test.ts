import { login } from "./auth";

const testOakUser = {
  id: 1,
  firebase_id: "123",
  email: "abc",
};
const testTokenValue = "token";
const testFirebaseUser = { uid: "123", email: "abc" };
const verifyIdTokenSpy = jest.fn(async () => testFirebaseUser);
const setCustomUserClaimsSpy = jest.fn();

jest.mock("./firebase", () => ({
  firebaseAdminAuth: {
    verifyIdToken: (...args: Parameters<typeof verifyIdTokenSpy>) =>
      verifyIdTokenSpy(...args),
    setCustomUserClaims: (...args: Parameters<typeof setCustomUserClaimsSpy>) =>
      setCustomUserClaimsSpy(...args),
  },
  firebaseAdminDatabase: {
    ref: jest.fn(() => ({ set: jest.fn() })),
  },
}));

const upsertUserSpy = jest.fn(async () => ({
  insert_user_one: testOakUser,
}));
jest.mock("./graphql", () => ({
  upsertUser: (...args: Parameters<typeof upsertUserSpy>) =>
    upsertUserSpy(...args),
}));

describe("node-lib/auth.ts", () => {
  describe("login()", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should return the result of upsertUser", async () => {
      const user = await login(testTokenValue);
      expect(user).toBe(testOakUser);
    });
    it("should call verifyIdToken", async () => {
      await login(testTokenValue);
      expect(verifyIdTokenSpy).toHaveBeenCalledWith(testTokenValue);
    });
    it("should call upsertUser with firebase user data", async () => {
      await login(testTokenValue);
      expect(upsertUserSpy).toHaveBeenCalledWith({
        user: {
          firebase_id: testFirebaseUser.uid,
          email: testFirebaseUser.email,
        },
      });
    });
    it.todo("should call setCustomUserClaims");
    it.todo("should throw if verifyIdToken fails");
    it.todo("should throw if upsertUser fails");
  });
});
