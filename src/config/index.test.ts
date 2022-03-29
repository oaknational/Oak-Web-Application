import config from ".";

const consoleWarnSpy = jest.spyOn(console, "warn");

describe("config.get()", () => {
  it("should retrieve the correct value from env", () => {
    const clientAppBaseUrl = config.get("clientAppBaseUrl");

    expect(clientAppBaseUrl).toBe("http://localhost:3000");
  });
  it("should console.warn if no value is found", () => {
    const nonExistentVarName = "nonExistentVarName";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.get(nonExistentVarName);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Tried to get config value for ${nonExistentVarName}, but none was found`
    );
  });
});
