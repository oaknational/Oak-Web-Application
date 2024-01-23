export const createLink = () => {
  const a = document.createElement("a");
  return a;
};

export const hideAndClickDownloadLink = (url: string, a: HTMLAnchorElement) => {
  a.style.display = "none";
  a.href = url;
  a.setAttribute("download", "download.zip");
  document.body.appendChild(a);
  a.click();

  return;
};

const createAndClickHiddenDownloadLink = (url: string) => {
  const link = createLink();
  hideAndClickDownloadLink(url, link);
};

export default createAndClickHiddenDownloadLink;
