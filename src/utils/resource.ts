export async function contentLengthFromResource(url: string) {
  const response = await fetch(url, { method: "HEAD" });
  const contentLength = response.headers.get("content-length");
  if (contentLength) {
    return Number.parseInt(contentLength);
  }
  return -1;
}
