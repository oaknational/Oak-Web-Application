import { isInIframe } from "@/utils/iframe";

export const createLink = (openInNewTab?: boolean) => {
  const a = document.createElement("a");
  if (openInNewTab) {
    a.setAttribute("target", "_blank");
  }
  return a;
};

export const hideAndClickDownloadLink = (url: string, a: HTMLAnchorElement) => {
  a.style.display = "none";
  a.href = encodeURI(url);
  a.setAttribute("download", "download.zip");
  document.body.appendChild(a);
  a.click();
};

const createAndClickHiddenDownloadLink = (
  url: string,
  openInNewTab?: boolean,
) => {
  if (isInIframe()) {
    globalThis.open(encodeURI(url), "_blank");
    return;
  }
  const link = createLink(openInNewTab);
  hideAndClickDownloadLink(url, link);
};

export default createAndClickHiddenDownloadLink;
