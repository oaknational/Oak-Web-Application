import { logErrorMessage } from "./testing";

describe("logErrorMessage", () => {
  let logSpy: jest.SpyInstance;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("does not log when in test env", () => {
    logErrorMessage("test1");
    expect(logSpy).toHaveBeenCalledTimes(0);
  });

  it("logs when in non-test env (string)", () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "development",
    };
    logErrorMessage("test2");
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith("test2");
  });

  it("logs when in non-test env (error object)", () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "development",
    };
    logErrorMessage(new Error("test3"));
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith("test3");
  });
});
