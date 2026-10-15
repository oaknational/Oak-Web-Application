export const nationalCurriculumInsightsOpenDownloadEvent =
  "oak:national-curriculum-insights:open-downloads";

export type NationalCurriculumInsightsOpenDownloadDetail = {
  returnFocusTo?: HTMLElement;
};

/** Opens the page's download form without changing the current selection. */
export const requestNationalCurriculumInsightsDownload = (
  returnFocusTo?: HTMLElement,
) => {
  window.dispatchEvent(
    new CustomEvent<NationalCurriculumInsightsOpenDownloadDetail>(
      nationalCurriculumInsightsOpenDownloadEvent,
      { detail: { returnFocusTo } },
    ),
  );
};
