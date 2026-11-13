import { connection } from "next/server";

import { getCachedMvRefreshTimes } from "./getMvRefreshTimeWithCache";

import errorReporter from "@/common-lib/error-reporter";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export async function getMvRefreshTime({ withCache }: { withCache: boolean }) {
  let mvRefreshTimes: {
    last_refresh_finish: string;
    materializedview_name: string;
  }[];

  if (withCache) {
    const { data } = await getCachedMvRefreshTimes();
    mvRefreshTimes = data;
  } else {
    const { data } = await curriculumApi2023.refreshedMVTime({
      viewName: "mv_curriculum_sequence_b%",
    });
    mvRefreshTimes = data;
  }

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
