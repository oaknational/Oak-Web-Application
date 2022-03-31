import camelcaseKeys from "camelcase-keys";

import { getSdk } from "./generated/sdk";
import client from "./client";

const snakeCaseApi = getSdk(client);

const camelCasePromiseResponse =
  <T, Args extends unknown[]>(fn: (...args: Args) => Promise<T>) =>
  async (...args: Args) => {
    const response = await fn(...args);
    return camelcaseKeys(response, { deep: true });
  };

/**
 * I've been unable to programmatically map the object from snakeCaseApi to api
 * Every attempt as lost type detail in one why or another
 */
const api = {
  lessonsBySlug: camelCasePromiseResponse(snakeCaseApi.lessonsBySlug),
  allLessons: camelCasePromiseResponse(snakeCaseApi.allLessons),
  bookmarkedLessonAdd: camelCasePromiseResponse(snakeCaseApi.bookmarkedLessonAdd),
  bookmarkedLessonRemove: camelCasePromiseResponse(snakeCaseApi.bookmarkedLessonRemove),
  bookmarkedLessons: camelCasePromiseResponse(snakeCaseApi.bookmarkedLessons),
};
for (const key in snakeCaseApi) {
  if (!(key in api)) {
    throw new Error(
      `Missing query found in generated sdk but not added to api: ${key}`
    );
  }
}

export default api;
