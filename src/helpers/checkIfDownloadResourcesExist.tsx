const checkIfDownloadResourcesExist = async (
  lessonSlug: string,
  resourceTypesString: string
) => {
  if (!process.env.VERCEL_API_URL) {
    throw new TypeError("process.env.VERCEL_API_URL must be defined");
  }

  const checkResourcesExistEndpoint = `${process.env.VERCEL_API_URL}/api/downloads/lesson/${lessonSlug}/check-files?selection=${resourceTypesString}`;

  try {
    const result = await fetch(checkResourcesExistEndpoint);
    const data = await result.json();

    return data;
  } catch (error) {
    // handle error
    console.log(error);
    return null;
  }
  // const res = await fetch(checkResourcesExistEndpoint);
  // const { data, error } = await res.json();

  // if (!res.ok && error) {
  //   console.log("checkResourcesExist error", error);
  //   throw new Error(error);
  // } else if (!res.ok) {
  //   throw new Error("API error");
  // }
  // return data;
};

export default checkIfDownloadResourcesExist;
