import applyHasuraClaimsToFirebaseUser from "./applyHasuraClaimsToFirebaseUser";

const firebaseId = "123";
const testOakUser = {
  id: 1,
  firebase_id: firebaseId,
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
    await applyHasuraClaimsToFirebaseUser({ firebaseId, user: testOakUser });
    expect(setCustomUserClaimsSpy).toHaveBeenCalledWith("123", {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-user-id": "1",
      },
    });
  });
});
