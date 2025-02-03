import {
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
    link.click = vi.fn();

    hideAndClickDownloadLink("testUrl", link);

    expect(link.click).toHaveBeenCalledTimes(1);
  });
});
