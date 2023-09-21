import downloadDebounceSubmit, {
  DownloadDebouncedSubmitProps,
} from "./downloadDebounceSubmit";

const onSubmit = jest.fn();
onSubmit.mockImplementationOnce(() => Promise.reject("Download failed!"));

onSubmit.mockImplementationOnce(() => Promise.resolve("Download successful!"));

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
    jest.clearAllMocks();
  });
  test("should report an error if failed to fetch downloads ", async () => {
    await downloadDebounceSubmit(
      props as unknown as DownloadDebouncedSubmitProps
    );
    expect(reportError).toBeCalled();
  });
  test("should update state for attempting to download ", async () => {
    await downloadDebounceSubmit(
      props as unknown as DownloadDebouncedSubmitProps
    );
    expect(setIsAttemptingDownload).toHaveBeenCalledTimes(2);
    expect(setEditDetailsClicked).toBeCalledWith(false);
  });
});
