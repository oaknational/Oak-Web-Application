/**
 * Used in curriculum download journeys on the unit listing page and curriculum download tab
 */

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;

  // Note: Optionally use 'x-filename' so we get the same filename on server and client
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

export const downloadFileFromUrl = async (downloadPath: string) => {
  const resp = await fetch(downloadPath);

  if (resp.status !== 200) {
    throw new Error(`Error: ${resp.status} ${resp.statusText}`);
  }

  const blob = await resp.blob();
  const filename = resp.headers.get("x-filename") ?? "download.docx";
  downloadBlob(blob, filename);
};
