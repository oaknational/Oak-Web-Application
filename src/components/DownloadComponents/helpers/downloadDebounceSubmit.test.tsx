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

const props = {
  data: {},
  lessonSlug: "123",
  setIsAttemptingDownload: jest.fn(),
  setEditDetailsClicked: jest.fn(),
  onSubmit: onSubmit,
};

describe("downloadDebounceSubmit", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });
  test("should throw an error if failed to fetch token ", async () => {
    await downloadDebounceSubmit(
      props as unknown as DownloadDebouncedSubmitProps
    );
    expect(reportError).toBeCalled();
  });
});
