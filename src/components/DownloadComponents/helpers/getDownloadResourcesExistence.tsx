import { ViewType } from "@/common-lib/urls";

const getDownloadResourcesExistence = async (
  lessonSlug: string,
  resourceTypesString: string,
  viewType: ViewType,
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

  const checkWhichResourcesExistEndpoint =
    viewType === "teachers"
      ? `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/downloads/lesson/${lessonSlug}/check-files?selection=${resourceTypesString}`
      : `${process.env.NEXT_PUBLIC_DOWNLOAD_API_URL}/api/lesson/${lessonSlug}/check-files?selection=${resourceTypesString}`;

  const res = await fetch(checkWhichResourcesExistEndpoint);
  const { data, error } = await res.json();

  if (!res.ok && error) {
    throw new Error(error);
  } else if (!res.ok) {
    throw new Error("API error");
  }
  return data;
};

export default getDownloadResourcesExistence;
