import { createMocks } from "node-mocks-http";

import handler from "../../../pages/api/login";

const testTokenValue = "test";
const okResponseData = {
  id: 1,
  email: "test@thenational.academy",
};
const errorResponseData = {
  message: "Failed to POST to /user",
};
const jsonSpy = jest.fn();
const statusSpy = jest.fn(() => ({ json: jsonSpy }));
const loginSpy = jest.fn(async () => okResponseData);
jest.mock("../../../node-lib/auth", () => ({
  login: jest.fn((...args: Parameters<typeof loginSpy>) => loginSpy(...args)),
}));

describe("/api/login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should respond with an oak user object when all is well", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { token: testTokenValue },
    });
    await handler(req, { ...res, status: statusSpy });

    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledWith(okResponseData);
  });
  it("should call the auth/login function", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { token: testTokenValue },
    });
    await handler(req, { ...res, status: statusSpy });

    expect(loginSpy).toHaveBeenCalledWith(testTokenValue);
  });
  it("should respond with an oak error when accessToken not found", async () => {
    const { req, res } = createMocks({ method: "POST" });
    await handler(req, { ...res, status: statusSpy });

    expect(jsonSpy).toHaveBeenCalledWith(errorResponseData);
  });
  it("should respond with an oak error if the login function fails", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { token: testTokenValue },
    });
    loginSpy.mockImplementationOnce(
      jest.fn(() => Promise.reject("something went wrong"))
    );

    await handler(req, { ...res, status: statusSpy });

    expect(jsonSpy).toHaveBeenCalledWith(errorResponseData);
  });
  it("should respond 405 if incorrect method passed", async () => {
    const { req, res } = createMocks({
      method: "GET",
      headers: { token: testTokenValue },
    });
    await handler(req, { ...res, status: statusSpy });

    expect(statusSpy).toHaveBeenCalledWith(405);
  });
});
