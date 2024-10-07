export function sortYears(a: string, b: string) {
  if (a === "all-years") {
    return -1;
  }
  return parseInt(a) - parseInt(b);
}
