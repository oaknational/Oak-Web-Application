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

export const isInIframe = () => {
  try {
    return globalThis.self !== globalThis.top;
  } catch {
    return true;
  }
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
