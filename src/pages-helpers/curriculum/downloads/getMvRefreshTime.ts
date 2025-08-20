import errorReporter from "@/common-lib/error-reporter";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export async function getMvRefreshTime() {
  const { data: mvRefreshTimes } = await curriculumApi2023.refreshedMVTime({
    viewName: "mv_curriculum_sequence_b%",
  });

  // Default result to current time in milliseconds
  let latestRefreshTime = Math.floor(Date.now());

  // If no refresh times are found, report an error
  if (!mvRefreshTimes || mvRefreshTimes.length === 0 || !mvRefreshTimes[0]) {
    const reportError = errorReporter("getMvRefreshTime");
    reportError(
      "Could not find MV refresh time for curriculum downloads cache",
    );
  } else {
    // Find the latest mv refresh time
    const latestRefresh = mvRefreshTimes.reduce((latest, current) => {
      const currentRefreshTime = new Date(
        current.last_refresh_finish,
      ).valueOf();
      return currentRefreshTime > latest ? currentRefreshTime : latest;
    }, new Date(mvRefreshTimes[0].last_refresh_finish).valueOf());

    // Update result with the latest refresh time
    latestRefreshTime = Math.floor(latestRefresh);
  }

  return latestRefreshTime;
}
