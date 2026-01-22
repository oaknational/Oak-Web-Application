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

const isInSandboxedIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

const createAndClickHiddenDownloadLink = (url: string) => {
  if (isInSandboxedIframe()) {
    window.open(encodeURI(url), "_blank");
    return;
  }

  const link = createLink();
  hideAndClickDownloadLink(url, link);
};

export default createAndClickHiddenDownloadLink;
