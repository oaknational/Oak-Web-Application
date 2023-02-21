const createAndClickHiddenDownloadLink = (url: string) => {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.setAttribute("download", "test.pdf");
  document.body.appendChild(a);
  a.click();
  if (typeof window !== "undefined") window.URL.revokeObjectURL(url);

  return {
    url,
  };
};

export default createAndClickHiddenDownloadLink;
