import { TeachersSitemap } from "@/node-lib/curriculum-api-2023/queries/teachersSitemap/teacherSitemap.query";

export type URLFields = { urls: string }[];

export const generateURLFields = (urls: URLFields) => {
  const lastmod = new Date().toISOString();
  return urls.map((url) => {
    return {
      loc: url.urls,
      lastmod,
    };
  });
};

export const splitURLsInHalf = (urls: TeachersSitemap, firstHalf: boolean) => {
  const middleIndex = Math.floor(urls.length / 2);
  return firstHalf ? urls.slice(0, middleIndex) : urls.slice(middleIndex);
};
