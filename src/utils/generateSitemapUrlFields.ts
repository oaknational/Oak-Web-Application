import { TeachersSitemap } from "@/node-lib/curriculum-api-2023/queries/teachersSitemap/teacherSitemap.query";

export type URLFields = { urls: string }[];

export const generateURLFields = (urls: URLFields) => {
  return urls.map((url) => {
    return {
      loc: url.urls,
      lastmod: new Date().toISOString(),
    };
  });
};

export const splitURLsInHalf = (urls: TeachersSitemap, firstHalf: boolean) => {
  const middleIndex = Math.floor(urls.length / 2);
  return firstHalf ? urls.slice(0, middleIndex) : urls.slice(middleIndex);
};
