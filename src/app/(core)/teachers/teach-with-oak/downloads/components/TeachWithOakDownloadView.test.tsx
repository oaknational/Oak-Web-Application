import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TeachWithOakDownloadView } from "./TeachWithOakDownloadView";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  LS_KEY_EMAIL,
  LS_KEY_SCHOOL,
  LS_KEY_TERMS,
} from "@/config/localStorageKeys";
import type { TeachWithOakShortReadsDownloads } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/teachWithOakShortReads.schema";

const render = renderWithProviders();

const mockReplace = jest.fn();
const mockSearchParams = jest.fn(() => new URLSearchParams());
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({ replace: mockReplace })),
  useSearchParams: () => mockSearchParams(),
}));

const mockOnSubmit = jest.fn();
jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useTeachWithOakDownload",
  () => ({
    __esModule: true,
    default: () => ({
      onSubmit: (...args: unknown[]) => mockOnSubmit(...args),
    }),
  }),
);

const mockHubspotSubmit = jest.fn();
jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit",
  () => ({
    useHubspotSubmit: () => ({
      onHubspotSubmit: (...args: unknown[]) => mockHubspotSubmit(...args),
    }),
  }),
);

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
  () => ({
    __esModule: true,
    ...jest.requireActual(
      "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
    ),
    waitForLinkCallback: (callback: () => void) => callback(),
  }),
);

const resources: TeachWithOakShortReadsDownloads = [
  { type: "explanation", exists: true, fileSize: "2 MB" },
  { type: "check-for-understanding", exists: true, fileSize: "1.5 MB" },
  { type: "feedback", exists: true, fileSize: "850 KB" },
  { type: "practice", exists: true, fileSize: "3 MB" },
];

const clickDownload = async () => {
  const downloadButton = await screen.findByRole("button", {
    name: "Download .zip",
  });
  await userEvent.click(downloadButton);
};

describe("TeachWithOakDownloadView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUseUserReturn(mockLoggedOut);
    mockSearchParams.mockReturnValue(new URLSearchParams());
    window.localStorage.setItem(LS_KEY_EMAIL, JSON.stringify("a@b.com"));
    window.localStorage.setItem(
      LS_KEY_SCHOOL,
      JSON.stringify({ schoolId: "123456-School", schoolName: "School" }),
    );
    window.localStorage.setItem(LS_KEY_TERMS, JSON.stringify(true));
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("renders the breadcrumbs and the short read resource cards", () => {
    render(<TeachWithOakDownloadView resources={resources} />);

    expect(
      screen.getByRole("link", { name: "Teach with Oak" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Explanation at Oak guide")).toBeInTheDocument();
  });

  it("navigates to the success page once the download has started", async () => {
    render(<TeachWithOakDownloadView resources={resources} />);

    await clickDownload();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/teachers/teach-with-oak/downloads/success",
      );
    });
    expect(mockHubspotSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText("Download started. This may take a few minutes"),
    ).toBeInTheDocument();
  });

  it("preserves the return to lesson params when navigating to the success page", async () => {
    const query = {
      returnTo:
        "/teachers/programmes/art-primary-ks1/units/unitSlug/lessons/lessonSlug",
      lessonName: "Lesson Name",
      unitName: "Unit Name",
    };
    mockSearchParams.mockReturnValue(new URLSearchParams(query));

    render(<TeachWithOakDownloadView resources={resources} />);

    await clickDownload();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        `/teachers/teach-with-oak/downloads/success?${new URLSearchParams(
          query,
        ).toString()}`,
      );
    });
  });

  it("shows an error message when the download fails", async () => {
    mockOnSubmit.mockRejectedValue(new Error("Download failed"));

    render(<TeachWithOakDownloadView resources={resources} />);

    await clickDownload();

    expect(
      await screen.findByText(
        "There was an error downloading your files. Please try again.",
      ),
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "Something went wrong with the download. Try refreshing the page.",
      ),
    ).toBeInTheDocument();
  });
});
