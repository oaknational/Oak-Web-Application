import { getClientEnvironment } from "./getClientEnvironment";

import { isInIframe } from "@/utils/iframe";

jest.mock("@/utils/iframe");

const mockIsInIframe = isInIframe as jest.MockedFunction<typeof isInIframe>;

describe("getClientEnvironment", () => {
  it("returns 'iframe' when running inside an iframe", () => {
    mockIsInIframe.mockReturnValue(true);
    expect(getClientEnvironment()).toBe("iframe");
  });

  it("returns 'web-browser' when not running inside an iframe", () => {
    mockIsInIframe.mockReturnValue(false);
    expect(getClientEnvironment()).toBe("web-browser");
  });
});
