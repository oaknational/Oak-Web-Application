const createDownloadResourcesLink = async (
  lessonSlug: string,
  selection: string,
  isLegacyDownload: boolean,
) => {
  if (!process.env.NEXT_PUBLIC_VERCEL_API_URL) {
    throw new TypeError(
      "process.env.NEXT_PUBLIC_VERCEL_API_URL must be defined",
    );
  }
  if (!process.env.NEXT_PUBLIC_DOWNLOAD_API_URL) {
    throw new TypeError(
      "process.env.NEXT_PUBLIC_DOWNLOAD_API_URL must be defined",
    );
  }

  const downloadEnpoint = isLegacyDownload
    ? `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/downloads/lesson/${lessonSlug}?selection=${selection}`
    : `${process.env.NEXT_PUBLIC_DOWNLOAD_API_URL}/api/lesson/${lessonSlug}/download?selection=${selection}`;

  const res = await fetch(downloadEnpoint);
  const { data, error } = await res.json();

  if (!res.ok && error) {
    throw new Error(error);
  } else if (!res.ok) {
    throw new Error("API error");
  }

  return data.url;
};

export default createDownloadResourcesLink;
