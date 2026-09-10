import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  it("converts bytes to gigabytes and returns string fixed to 2 decimal place", () => {
    const result = formatBytes(2000000000);
    expect(result).toBe("1.86 GB");
  });

  it("converts bytes to megabytes and returns string fixed to 1 decimal place", () => {
    const result = formatBytes(13456325);
    expect(result).toBe("12.8 MB");
  });

  it("converts bytes to kilobytes and returns string integer rounded", () => {
    const result = formatBytes(3456);
    expect(result).toBe("3 KB");
  });

  it("doesn't convert bytes if the size is too small to be converted", () => {
    const result = formatBytes(876);
    expect(result).toBe("876 B");
  });
});
