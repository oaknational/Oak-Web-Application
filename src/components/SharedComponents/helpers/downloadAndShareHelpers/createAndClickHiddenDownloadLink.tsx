import { isInIframe } from "@/utils/iframe";

export const createLink = () => {
  const a = document.createElement("a");
  return a;
};

export const hideAndClickDownloadLink = (url: string, a: HTMLAnchorElement) => {
  a.style.display = "none";
  a.href = encodeURI(url);
  a.setAttribute("download", "download.zip");
  document.body.appendChild(a);
  a.click();
};

const createAndClickHiddenDownloadLink = (url: string) => {
  if (isInIframe()) {
    globalThis.open(encodeURI(url), "_blank", "noopener,noreferrer");
    return;
  }
  const link = createLink();
  hideAndClickDownloadLink(url, link);
};

export default createAndClickHiddenDownloadLink;
