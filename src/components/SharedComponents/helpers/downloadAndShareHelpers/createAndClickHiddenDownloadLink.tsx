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

export const hideAndClickDownloadLink = (
  url: string,
  a: HTMLAnchorElement,
  filename = "download.zip",
) => {
  a.style.display = "none";
  a.href = encodeURI(url);
  a.setAttribute("download", filename);
  a.addEventListener("click", () => {
    // Allows verification that the link has been clicked, used in the teacher lesson download journey
    a.setAttribute("clicked", "true");
  });
  document.body.appendChild(a);
  a.click();
};

type DownloadLinkOptions = {
  filename?: string;
  removeAfterClick?: boolean;
  openInNewTabWhenEmbedded?: boolean;
};

const createAndClickHiddenDownloadLink = (
  url: string,
  {
    filename = "download.zip",
    removeAfterClick = false,
    openInNewTabWhenEmbedded = true,
  }: DownloadLinkOptions = {},
) => {
  if (openInNewTabWhenEmbedded && isInIframe()) {
    globalThis.open(encodeURI(url), "_blank");
    return;
  }
  const link = createLink();
  try {
    hideAndClickDownloadLink(url, link, filename);
  } finally {
    if (removeAfterClick) link.remove();
  }
};

export const waitForLinkCallback = (callback: () => void) => {
  // Ensure the download link has been clicked before initiating the callback fn
  let retryCount = 0;
  const pollForLink = () => {
    const linkElement = getDownloadLink();
    if (linkElement?.hasAttribute("clicked")) {
      // Safari needs additional time to actually initiate the download
      // after the click event fires, before the page can navigate
      setTimeout(callback, 1000);
    } else if (retryCount < 9) {
      retryCount++;
      setTimeout(pollForLink, 100);
    }
  };

  setTimeout(pollForLink, 100);
};

export default createAndClickHiddenDownloadLink;
