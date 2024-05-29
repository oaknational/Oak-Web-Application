export type URLFields = { urls: string }[];

export const generateURLFields = (urls: URLFields) => {
  return urls.map((url) => {
    return {
      loc: url.urls,
      lastmod: new Date().toISOString(),
    };
  });
};
