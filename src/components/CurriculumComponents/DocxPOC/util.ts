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

export function padTwoDigits(num: number) {
  return num.toString().padStart(2, "0");
}

export const formattedDate = (date: Date): string => {
  const dateStr = [
    padTwoDigits(date.getDate()),
    padTwoDigits(date.getMonth() + 1),
    date.getFullYear(),
  ].join("-");

  const timeStr = [
    padTwoDigits(date.getHours()),
    padTwoDigits(date.getMinutes()),
    padTwoDigits(date.getSeconds()),
  ].join("-");

  return `${dateStr} ${timeStr}`;
};

export const capitalizeFirstLetter = (str: string) => {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
