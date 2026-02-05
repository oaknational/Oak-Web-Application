import createAndClickHiddenDownloadLink, {
  hideAndClickDownloadLink,
  createLink,
} from "./createAndClickHiddenDownloadLink";

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
});
