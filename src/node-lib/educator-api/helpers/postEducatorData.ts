export const postEducatorData = async (url: string, onErr?: () => void) => {
  const response = await fetch(url, { method: "POST" });

  if (!response.ok) {
    if (onErr) {
      onErr();
    }
  }

  return response.ok;
};
