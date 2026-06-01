import { isInIframe } from "@/utils/iframe";

const downloadLinkId = "resource-download-link";
export const getDownloadLink = () => {
  const link = document.getElementById(downloadLinkId);
  return link;
};

export const createLink = () => {
  const previousLink = getDownloadLink();
  if (previousLink) {
    previousLink.remove();
  }
  const a = document.createElement("a");
  a.setAttribute("id", downloadLinkId);
  return a;
};

export const hideAndClickDownloadLink = (url: string, a: HTMLAnchorElement) => {
  a.style.display = "none";
  a.href = encodeURI(url);
  a.setAttribute("download", "download.zip");
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
