export const download = (data: Uint8Array, fileName: string): void => {
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url: string = URL.createObjectURL(blob);

  const a: HTMLAnchorElement = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
