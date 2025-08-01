import { render } from "@testing-library/react";

import AppHooks from "./AppHooks";

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      pageView: jest.fn(),
    },
  }),
}));
const mockBrowserConfig = jest.fn();
jest.mock("@/browser-lib/getBrowserConfig", () => ({
  __esModule: true,
  default: () => mockBrowserConfig(),
}));
jest.mock("@oaknational/oak-consent-client", () => ({
  __esModule: true,
  useOakConsent: () => ({
    getConsent: jest.fn().mockReturnValue("granted"),
  }),
}));

const mockUseSentry = jest.fn();
jest.mock("@/browser-lib/sentry/useSentry", () => ({
  __esModule: true,
  default: () => mockUseSentry(),
}));
const mockUseBugsnag = jest.fn();
jest.mock("@/browser-lib/bugsnag/useBugsnag", () => ({
  __esModule: true,
  default: () => mockUseBugsnag(),
}));
jest.mock("@/browser-lib/gleap", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("@/browser-lib/axe/useAxe", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("AppHooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("intialises sentry when enabled", () => {
    mockBrowserConfig.mockReturnValue("true");
    render(<AppHooks />);
    expect(mockUseSentry).toHaveBeenCalled();
    expect(mockUseBugsnag).not.toHaveBeenCalled();
  });
  it("initialises bugsnag when sentry is not enabled", () => {
    mockBrowserConfig.mockReturnValue("false");
    render(<AppHooks />);
    expect(mockUseBugsnag).toHaveBeenCalled();
    expect(mockUseSentry).not.toHaveBeenCalled();
  });
});
