import startGleap from "./startGleap";

const setFrameUrl = jest.fn();
const setApiUrl = jest.fn();
const initialize = jest.fn();

jest.mock("gleap", () => ({
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
    jest.clearAllMocks();
    jest.resetModules();
  });
  test("should set Gleap on the window object", () => {
    startGleap(gleapConfig);

    expect(window.Gleap).toBeTruthy();
  });
  test("should set the correct frame url", () => {
    startGleap(gleapConfig);

    expect(setFrameUrl).toHaveBeenCalledWith(frameUrl);
  });
  test("should set the correct api url", () => {
    startGleap(gleapConfig);

    expect(setApiUrl).toHaveBeenCalledWith(apiUrl);
  });
  test("should call Gleap.initialise with apiKey", () => {
    startGleap(gleapConfig);

    expect(initialize).toHaveBeenCalledWith(apiKey);
  });
});
