describe("getServerConfig()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should allow parsing of 'on' switches to boolean true", async () => {
    process.env.DISABLE_ISR = "on";
    const { default: getServerConfig } = await import(
      "../node-lib/getServerConfig"
    );

    expect(getServerConfig("disableIsr")).toEqual(true);
  });
  it("should allow parsing of 'on' switches with non-'on' to boolean false", async () => {
    process.env.DISABLE_ISR = "anything_but_on";
    const { default: getServerConfig } = await import(
      "../node-lib/getServerConfig"
    );

    expect(getServerConfig("disableIsr")).toEqual(false);
  });
});

export {};
