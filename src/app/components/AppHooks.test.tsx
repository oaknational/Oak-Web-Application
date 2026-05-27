import { render } from "@testing-library/react";

import { AppHooks } from "./AppHooks";

import useGleap from "@/browser-lib/gleap";

const mockGetConsent = jest.fn();
jest.mock("@oaknational/oak-consent-client", () => ({
  __esModule: true,
  useOakConsent: () => ({
    getConsent: (...args: unknown[]) => mockGetConsent(...args),
  }),
}));

jest.mock("@/browser-lib/gleap", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/hooks/useCheckUserMetadata", () => ({
  __esModule: true,
  useCheckUserMetadata: jest.fn(),
}));

jest.mock("@/hooks/usePostHogAlias", () => ({
  __esModule: true,
  usePostHogAlias: jest.fn(),
}));

describe("AppHooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders null", () => {
    mockGetConsent.mockReturnValue("granted");
    const { container } = render(<AppHooks />);
    expect(container.innerHTML).toBe("");
  });

  it("calls useGleap with enabled true when consent is granted", () => {
    mockGetConsent.mockReturnValue("granted");
    render(<AppHooks />);
    expect(mockGetConsent).toHaveBeenCalledWith("statistics");
    expect(useGleap).toHaveBeenCalledWith({ enabled: true });
  });

  it("calls useGleap with enabled false when consent is denied", () => {
    mockGetConsent.mockReturnValue("denied");
    render(<AppHooks />);
    expect(useGleap).toHaveBeenCalledWith({ enabled: false });
  });

  it("calls useGleap with enabled false when consent is pending", () => {
    mockGetConsent.mockReturnValue("pending");
    render(<AppHooks />);
    expect(useGleap).toHaveBeenCalledWith({ enabled: false });
  });
});
