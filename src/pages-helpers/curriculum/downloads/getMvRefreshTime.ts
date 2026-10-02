import { connection } from "next/server";

import { applyCachePolicy } from "@/node-lib/cache";
import errorReporter from "@/common-lib/error-reporter";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

async function getCachedMvRefreshTimes() {
  "use cache";
  applyCachePolicy();

  return curriculumApi2023.refreshedMVTime({
    viewName: "mv_curriculum_sequence_b%",
  });
}

export async function getMvRefreshTime() {
  const { data: mvRefreshTimes } = await getCachedMvRefreshTimes();

  // If no refresh times are found, report an error
  if (!mvRefreshTimes || mvRefreshTimes.length === 0 || !mvRefreshTimes[0]) {
    await connection();
    const latestRefreshTime = Math.floor(Date.now());
    const reportError = errorReporter("getMvRefreshTime");
    reportError(
      "Could not find MV refresh time for curriculum downloads cache",
    );
    return latestRefreshTime;
  }

  const latestRefresh = mvRefreshTimes.reduce((latest, current) => {
    const currentRefreshTime = new Date(current.last_refresh_finish).valueOf();
    return currentRefreshTime > latest ? currentRefreshTime : latest;
  }, new Date(mvRefreshTimes[0].last_refresh_finish).valueOf());

  return Math.floor(latestRefresh);
}
