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

const widgetUrl = "https://feedback-widget.thenational.academy";
const apiUrl = "https://feedback-api.thenational.academy";
const widgetId = "SAlYMttkyMt51GRHLul4GYU8TCC5EXjs";
const gleapConfig = {
  widgetUrl,
  apiUrl,
  widgetId,
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
  test("should set the correct widget url", () => {
    startGleap(gleapConfig);

    expect(setWidgetUrl).toHaveBeenCalledWith(widgetUrl);
  });
  test("should set the correct api url", () => {
    startGleap(gleapConfig);

    expect(setApiUrl).toHaveBeenCalledWith(apiUrl);
  });
  test("should call Gleap.initialise with widgetId", () => {
    startGleap(gleapConfig);

    expect(initialize).toHaveBeenCalledWith(widgetId);
  });
});
