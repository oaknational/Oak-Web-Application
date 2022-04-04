import config from ".";

const consoleWarnSpy = jest.spyOn(console, "warn");

describe("config.get()", () => {
  it("should retrieve the correct value from env", () => {
    const clientAppBaseUrl = config.get("clientAppBaseUrl");

    expect(clientAppBaseUrl).toBe("http://localhost:3000");
  });
  it.skip("should warn if no value found", () => {
    process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL = undefined;

    config.get("clientAppBaseUrl");

    expect(config.get("clientAppBaseUrl")).toThrow();
  });
  it.skip("should throw for non-existent name", () => {
    const nonExistentVarName = "nonExistentVarName";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.get(nonExistentVarName);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Tried to get config value for ${nonExistentVarName}, but none was found`
    );
  });
});
