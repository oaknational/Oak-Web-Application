import OakError from "../../../errors/OakError";

import downloadDebounceSubmit, {
  DownloadDebouncedSubmitProps,
} from "./downloadDebounceSubmit";

// const onSubmit = jest.fn().mockRejectedValue(new Error("Failed to fetch"));
const onSubmit = () =>
  Promise.reject(new OakError({ code: "hubspot/invalid-email" }));

const reportError = jest.fn();
jest.mock("../../../common-lib/error-reporter/", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const setIsAttemptingDownload = jest.fn();
const setEditDetailsClicked = jest.fn();

const props = {
  data: {},
  lessonSlug: "123",
  setIsAttemptingDownload,
  setEditDetailsClicked,
  onSubmit: onSubmit,
};

describe("downloadDebounceSubmit", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });
  test("should report an error if failed to fetch downloads ", async () => {
    await downloadDebounceSubmit(
      props as unknown as DownloadDebouncedSubmitProps
    );
    expect(reportError).toBeCalled();
  });
  test("should update state for attempting tpo download ", async () => {
    await downloadDebounceSubmit(
      props as unknown as DownloadDebouncedSubmitProps
    );
    expect(setIsAttemptingDownload).toBeCalled();
  });
});
