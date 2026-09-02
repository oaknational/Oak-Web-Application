import createAndClickHiddenDownloadLink, {
  hideAndClickDownloadLink,
  createLink,
  waitForLinkCallback,
  getDownloadLink,
} from "./createAndClickHiddenDownloadLink";

var mockReportError = jest.fn();
jest.mock("../../../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: any[]) =>
      mockReportError(...args),
}));

describe("hideAndClickDownloadLink()", () => {
  it("hides the link", () => {
    const link = createLink();
    hideAndClickDownloadLink("testUrl", link);

    expect(link.style.display).toEqual("none");
  });

  it("sets correct download attribute", () => {
    const link = createLink();
    hideAndClickDownloadLink("testUrl", link);

    expect(link.getAttribute("download")).toEqual("download.zip");
  });

  it("sets correct href on the link", () => {
    const link = createLink();
    hideAndClickDownloadLink("testUrl", link);

    expect(link.getAttribute("href")).toEqual("testUrl");
  });

  it("click the link", () => {
    const link = createLink();
    link.click = jest.fn();

    hideAndClickDownloadLink("testUrl", link);

    expect(link.click).toHaveBeenCalledTimes(1);
  });
});

describe("createAndClickHiddenDownloadLink()", () => {
  const originalTop = window.top;
  let windowOpenSpy: jest.SpyInstance;

  beforeEach(() => {
    windowOpenSpy = jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    Object.defineProperty(window, "top", {
      value: originalTop,
      writable: true,
    });
    windowOpenSpy.mockRestore();
  });

  beforeEach(() => {
    mockReportError.mockClear();
  });

  it("opens download in a new tab when inside an iframe", () => {
    Object.defineProperty(window, "top", {
      value: {}, // different object from window.self
      writable: true,
    });

    createAndClickHiddenDownloadLink("testUrl");

    expect(windowOpenSpy).toHaveBeenCalledWith("testUrl", "_blank");
  });

  it("creates a hidden download link when not in an iframe", () => {
    Object.defineProperty(window, "top", {
      value: window.self,
      writable: true,
    });

    const appendSpy = jest.spyOn(document.body, "appendChild");
    createAndClickHiddenDownloadLink("testUrl");

    expect(windowOpenSpy).not.toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    appendSpy.mockRestore();
  });

  it("reports when removing the previous link fails and still creates a new link", () => {
    const removeError = new Error("remove failed");
    const existingLink = document.getElementById("resource-download-link");
    existingLink?.remove();
    const previousLink = document.createElement("a");
    previousLink.id = "resource-download-link";
    document.body.appendChild(previousLink);
    const removeSpy = jest
      .spyOn(previousLink, "remove")
      .mockImplementation(() => {
        throw removeError;
      });

    const link = createLink();

    expect(link).toBeInstanceOf(HTMLAnchorElement);
    expect(link.id).toBe("resource-download-link");
    expect(mockReportError).toHaveBeenCalledWith(removeError);

    removeSpy.mockRestore();
    previousLink.parentNode?.removeChild(previousLink);
  });
});

const mockCallback = jest.fn();
jest.useFakeTimers();
const setTimeoutMock = jest.spyOn(globalThis, "setTimeout");

describe("waitForLinkCallback", () => {
  beforeEach(() => {
    const previousLink = getDownloadLink();
    if (previousLink) {
      previousLink.remove();
    }
  });
  test("runs a maximum number of times", () => {
    waitForLinkCallback(mockCallback);
    jest.runAllTimers();
    expect(setTimeoutMock).toHaveBeenCalledTimes(10);
    expect(mockCallback).not.toHaveBeenCalled();
  });
  test("it calls the callback", () => {
    createAndClickHiddenDownloadLink("testUrl");
    waitForLinkCallback(mockCallback);
    jest.runAllTimers();
    expect(mockCallback).toHaveBeenCalled();
  });
});
