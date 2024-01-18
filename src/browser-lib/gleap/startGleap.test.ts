import startGleap from "./startGleap";

const setFrameUrl = vi.fn();
const setApiUrl = vi.fn();
const initialize = vi.fn();

vi.mock("gleap", () => ({
  __esModule: true,
  default: {
    setFrameUrl: (url: string) => setFrameUrl(url),
    setApiUrl: (url: string) => setApiUrl(url),
    initialize: (url: string) => initialize(url),
  },
}));

const frameUrl = "frame-url";
const apiUrl = "api-url";
const apiKey = "api-key";
const gleapConfig = {
  frameUrl,
  apiUrl,
  apiKey,
};

describe("startGleap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  it("should set Gleap on the window object", () => {
    startGleap(gleapConfig);

    expect(window.Gleap).toBeTruthy();
  });
  it("should set the correct frame url", () => {
    startGleap(gleapConfig);

    expect(setFrameUrl).toHaveBeenCalledWith(frameUrl);
  });
  it("should set the correct api url", () => {
    startGleap(gleapConfig);

    expect(setApiUrl).toHaveBeenCalledWith(apiUrl);
  });
  it("should call Gleap.initialise with apiKey", () => {
    startGleap(gleapConfig);

    expect(initialize).toHaveBeenCalledWith(apiKey);
  });
});
