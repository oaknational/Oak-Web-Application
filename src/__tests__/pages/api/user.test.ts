import handler from "../../../pages/api/user";
import { createNextApiMocks } from "../../__helpers__/createNextApiMocks";

const testTokenValue = "test";
const testEmail = "test@thenational.academy";
const firebaseId = "123";
const testOakUser = {
  id: 1,
  firebase_id: firebaseId,
  email: testEmail,
};
const authHeaders = { authorization: `Bearer ${testTokenValue}` };
const createReqRes = () =>
  createNextApiMocks({
    method: "POST",
    headers: authHeaders,
  });
const okResponseData = {
  id: 1,
  email: testEmail,
  firebase_id: firebaseId,
};
const errorResponseData = {
  message: "Failed to POST to /user",
};
const verifyFirebaseToken = jest.fn(async () => ({
  firebaseId,
  email: testEmail,
}));
const getOrCreateOakUser = jest.fn(async () => testOakUser);
const applyHasuraClaimsToFirebaseUser = jest.fn();
jest.mock("../../../node-lib/auth/verifyFirebaseToken", () => ({
  __esModule: true,
  default: (...args: []) => verifyFirebaseToken(...args),
}));
jest.mock("../../../node-lib/auth/getOrCreateOakUser", () => ({
  __esModule: true,
  default: (...args: []) => getOrCreateOakUser(...args),
}));
jest.mock("../../../node-lib/auth/applyHasuraClaimsToFirebaseUser", () => ({
  __esModule: true,
  default: (...args: []) => applyHasuraClaimsToFirebaseUser(...args),
}));

describe("POST /api/user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  /**
   * Test the response object in case of success
   */
  it("should respond with an oak user object when all is well", async () => {
    const { req, res } = createReqRes();
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(okResponseData);
  });
  /**
   * Test the route makes the correct calls in case of success
   */
  it("should call verifyFirebaseToken()", async () => {
    const { req, res } = createReqRes();
    await handler(req, res);

    expect(verifyFirebaseToken).toHaveBeenCalledWith({
      accessToken: testTokenValue,
    });
  });
  it("should call getOrCreateOakUser()", async () => {
    const { req, res } = createReqRes();
    await handler(req, res);

    expect(getOrCreateOakUser).toHaveBeenCalledWith({
      firebaseId,
      email: testEmail,
    });
  });
  it("should call applyHasuraClaimsToFirebaseUser()", async () => {
    const { req, res } = createReqRes();
    await handler(req, res);

    expect(applyHasuraClaimsToFirebaseUser).toHaveBeenCalledWith({
      firebaseId,
      user: testOakUser,
    });
  });

  /**
   * Test the route responds with the correct errors in case of failure
   */
  it.skip("should respond with an oak error when accessToken not found", async () => {
    const { req, res } = createNextApiMocks({ method: "POST" });
    await handler(req, res);

    expect(res._getJSONData()).toEqual(errorResponseData);
  });
  it.skip("should respond with an oak error if verifyFirebaseToken() fails", async () => {
    const { req, res } = createReqRes();
    verifyFirebaseToken.mockImplementationOnce(
      jest.fn(() => Promise.reject("something went wrong"))
    );

    await handler(req, res);

    expect(res._getJSONData()).toEqual(errorResponseData);
  });

  it("should respond 405 if incorrect method passed", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      headers: authHeaders,
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
