import startGleap from "./startGleap";

const setWidgetUrl = jest.fn();
const setApiUrl = jest.fn();
const initialize = jest.fn();

jest.mock("gleap", () => ({
  __esModule: true,
  default: {
    setWidgetUrl: (url: string) => setWidgetUrl(url),
    setApiUrl: (url: string) => setApiUrl(url),
    initialize: (url: string) => initialize(url),
  },
}));

const widgetUrl = "widget-url";
const apiUrl = "api-url";
const apiKey = "api-key";
const gleapConfig = {
  widgetUrl,
  apiUrl,
  apiKey,
};

describe("startGleap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  test("should set Gleap on the window object", async () => {
    await startGleap(gleapConfig);

    expect(window.Gleap).toBeTruthy();
  });
  test("should set the correct widget url", async () => {
    await startGleap(gleapConfig);

    expect(setWidgetUrl).toHaveBeenCalledWith(widgetUrl);
  });
  test("should set the correct api url", async () => {
    await startGleap(gleapConfig);

    expect(setApiUrl).toHaveBeenCalledWith(apiUrl);
  });
  test("should call Gleap.initialise with apiKey", async () => {
    await startGleap(gleapConfig);

    expect(initialize).toHaveBeenCalledWith(apiKey);
  });
});
