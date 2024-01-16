import downloadDebounceSubmit, {
  DownloadDebouncedSubmitProps,
} from "./downloadDebounceSubmit";

const reportError = vi.fn();
vi.mock("@/common-lib/error-reporter/", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const setIsAttemptingDownload = vi.fn();
const setEditDetailsClicked = vi.fn();
const setApiError = vi.fn();
const onSubmit = vi.fn();

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
    vi.clearAllMocks();
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
