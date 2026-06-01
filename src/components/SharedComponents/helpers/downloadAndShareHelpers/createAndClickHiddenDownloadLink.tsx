import { isInIframe } from "@/utils/iframe";

export const createLink = () => {
  const a = document.createElement("a");
  return a;
};

export const hideAndClickDownloadLink = (url: string, a: HTMLAnchorElement) => {
  a.style.display = "none";
  a.href = encodeURI(url);
  a.setAttribute("download", "download.zip");
  a.setAttribute("id", "resource-download-link");
  a.addEventListener("click", () => {
    // Allows verification that the link has been clicked, used in the teacher lesson download journey
    a.setAttribute("clicked", "true");
  });
  document.body.appendChild(a);
  a.click();
};

const createAndClickHiddenDownloadLink = (url: string) => {
  if (isInIframe()) {
    globalThis.open(encodeURI(url), "_blank");
    return;
  }
  const link = createLink();
  hideAndClickDownloadLink(url, link);
};

export default createAndClickHiddenDownloadLink;
