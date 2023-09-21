import downloadDebounceSubmit, {
  DownloadDebouncedSubmitProps,
} from "./downloadDebounceSubmit";

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
const setApiError = jest.fn();
const onSubmit = jest.fn();

const props = {
  data: {},
  lessonSlug: "123",
  setIsAttemptingDownload,
  setEditDetailsClicked,
  setApiError,
  onSubmit,
};

describe("downloadDebounceSubmit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should report an error if failed to fetch downloads and throws on error", async () => {
    onSubmit.mockImplementationOnce(() => Promise.reject("Download failed!"));

    downloadDebounceSubmit(
      props as unknown as DownloadDebouncedSubmitProps,
    ).catch((error) => {
      expect(reportError).toBeCalled();
      expect(error.code).toEqual("downloads/failed-to-fetch");
    });
  });
  test("should update state for attempting to download ", async () => {
    onSubmit.mockImplementationOnce(() =>
      Promise.resolve("Download successful!"),
    );

    await downloadDebounceSubmit(
      props as unknown as DownloadDebouncedSubmitProps,
    );
    expect(setIsAttemptingDownload).toHaveBeenCalledTimes(2);
    expect(setEditDetailsClicked).toBeCalledWith(false);
  });
});
