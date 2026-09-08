import createAndClickHiddenDownloadLink, {
  hideAndClickDownloadLink,
  createLink,
  waitForLinkCallback,
  getDownloadLink,
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

  it.each(["Science - primary.docx", "Curriculum insights.zip"])(
    "preserves the supplied filename %s and removes a temporary link",
    (filename) => {
      const click = jest
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(function (this: HTMLAnchorElement) {
          expect(this.download).toBe(filename);
          expect(this.href).toContain("blob:insights");
          expect(document.body).toContainElement(this);
        });

      createAndClickHiddenDownloadLink("blob:insights", {
        filename,
        removeAfterClick: true,
        openInNewTabWhenEmbedded: false,
      });

      expect(click).toHaveBeenCalledTimes(1);
      expect(getDownloadLink()).toBeNull();
      click.mockRestore();
    },
  );

  it("can download a blob without opening a new tab in an embedded preview", () => {
    Object.defineProperty(window, "top", { value: {}, writable: true });
    const click = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    createAndClickHiddenDownloadLink("blob:insights", {
      filename: "Science.docx",
      removeAfterClick: true,
      openInNewTabWhenEmbedded: false,
    });

    expect(windowOpenSpy).not.toHaveBeenCalled();
    expect(click).toHaveBeenCalledTimes(1);
    expect(getDownloadLink()).toBeNull();
    click.mockRestore();
  });

  it("removes a temporary link if clicking fails", () => {
    const click = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {
        throw new Error("Download failed");
      });

    expect(() =>
      createAndClickHiddenDownloadLink("blob:insights", {
        removeAfterClick: true,
        openInNewTabWhenEmbedded: false,
      }),
    ).toThrow("Download failed");
    expect(getDownloadLink()).toBeNull();
    click.mockRestore();
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
