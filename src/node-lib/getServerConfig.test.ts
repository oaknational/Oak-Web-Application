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
  it("Should return the default value if a required env is set to undefined", async () => {
    process.env.SANITY_DATASET_TAG = undefined;
    const { default: getServerConfig } = await import(
      "../node-lib/getServerConfig"
    );

    expect(getServerConfig("sanityDatasetTag")).toEqual("default");
  });
  it("Should return the default value if a required env is set to an empty string", async () => {
    process.env.SANITY_DATASET_TAG = "";
    const { default: getServerConfig } = await import(
      "../node-lib/getServerConfig"
    );

    expect(getServerConfig("sanityDatasetTag")).toEqual("default");
  });
  it("Should return the set value if a required env is set to any other string", async () => {
    process.env.SANITY_DATASET_TAG = "false";
    const { default: getServerConfig } = await import(
      "../node-lib/getServerConfig"
    );

    expect(getServerConfig("sanityDatasetTag")).toEqual("false");
  });
});

export {};
