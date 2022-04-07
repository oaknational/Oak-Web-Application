import handler from "../../../pages/api/login";
import { createNextApiMocks } from "../../__helpers__/createNextApiMocks";

const testTokenValue = "test";
const okResponseData = {
  id: 1,
  email: "test@thenational.academy",
};
const errorResponseData = {
  message: "Failed to POST to /user",
};
const loginSpy = jest.fn(async () => okResponseData);
jest.mock("../../../node-lib/auth", () => ({
  login: jest.fn((...args: Parameters<typeof loginSpy>) => loginSpy(...args)),
}));

describe("/api/login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should respond with an oak user object when all is well", async () => {
    const { req, res } = createNextApiMocks({
      method: "POST",
      headers: { token: testTokenValue },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(okResponseData);
  });
  it("should call the auth/login function", async () => {
    const { req, res } = createNextApiMocks({
      method: "POST",
      headers: { token: testTokenValue },
    });
    await handler(req, res);

    expect(loginSpy).toHaveBeenCalledWith(testTokenValue);
  });
  it("should respond with an oak error when accessToken not found", async () => {
    const { req, res } = createNextApiMocks({ method: "POST" });
    await handler(req, res);

    expect(res._getJSONData()).toEqual(errorResponseData);
  });
  it("should respond with an oak error if the login function fails", async () => {
    const { req, res } = createNextApiMocks({
      method: "POST",
      headers: { token: testTokenValue },
    });
    loginSpy.mockImplementationOnce(
      jest.fn(() => Promise.reject("something went wrong"))
    );

    await handler(req, res);

    expect(res._getJSONData()).toEqual(errorResponseData);
  });
  it("should respond 405 if incorrect method passed", async () => {
    const { req, res } = createNextApiMocks({
      method: "GET",
      headers: { token: testTokenValue },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
