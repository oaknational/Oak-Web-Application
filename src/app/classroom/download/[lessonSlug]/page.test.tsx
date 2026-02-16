import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { createLessonDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import {
  createLink,
  hideAndClickDownloadLink,
} from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

const useParamsMock = jest.fn();
const useSearchParamsMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useParams: () => useParamsMock(),
  useSearchParams: () => useSearchParamsMock(),
}));

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink",
  () => ({
    createLessonDownloadLink: jest.fn(),
  }),
);

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
  () => ({
    createLink: jest.fn(() => {
      const a = document.createElement("a");
      a.click = jest.fn();
      return a;
    }),
    hideAndClickDownloadLink: jest.fn(),
  }),
);

const mockCreateLessonDownloadLink =
  createLessonDownloadLink as jest.MockedFunction<
    typeof createLessonDownloadLink
  >;

describe("ClassroomDownloadPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParamsMock.mockReturnValue({ lessonSlug: "test-lesson-slug" });
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("selection=presentation,worksheet-pdf"),
    );
  });

  it("renders heading and loading state when lessonSlug and selection are present", () => {
    renderWithTheme(<Page />);

    expect(screen.getByText("Download lesson resources")).toBeInTheDocument();
    expect(screen.getByText("Preparing your download...")).toBeInTheDocument();
  });

  it("shows invalid link message when lessonSlug is missing", () => {
    useParamsMock.mockReturnValue({ lessonSlug: "" });

    renderWithTheme(<Page />);

    expect(screen.getByText("Invalid download link")).toBeInTheDocument();
  });

  it("shows invalid link message when selection is missing", () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

    renderWithTheme(<Page />);

    expect(screen.getByText("Invalid download link")).toBeInTheDocument();
  });

  it("calls createLessonDownloadLink with correct params automatically on mount", async () => {
    mockCreateLessonDownloadLink.mockResolvedValue("https://signed-url.com");

    renderWithTheme(<Page />);

    await waitFor(() => {
      expect(createLessonDownloadLink).toHaveBeenCalledWith({
        lessonSlug: "test-lesson-slug",
        selection: "presentation,worksheet-pdf",
        additionalFilesIdsSelection: undefined,
        isLegacyDownload: false,
      });
    });
  });

  it("passes additionalFiles when present in search params", async () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("selection=presentation&additionalFiles=1,2,3"),
    );
    mockCreateLessonDownloadLink.mockResolvedValue("https://signed-url.com");

    renderWithTheme(<Page />);

    await waitFor(() => {
      expect(createLessonDownloadLink).toHaveBeenCalledWith({
        lessonSlug: "test-lesson-slug",
        selection: "presentation",
        additionalFilesIdsSelection: "1,2,3",
        isLegacyDownload: false,
      });
    });
  });

  it("triggers download and shows success message after download completes", async () => {
    mockCreateLessonDownloadLink.mockResolvedValue("https://signed-url.com");

    renderWithTheme(<Page />);

    await waitFor(() => {
      expect(createLink).toHaveBeenCalled();
      expect(hideAndClickDownloadLink).toHaveBeenCalledWith(
        "https://signed-url.com",
        expect.any(HTMLAnchorElement),
      );
    });

    expect(screen.getByText("Your download has started.")).toBeInTheDocument();
    expect(screen.getByText("You can close this tab.")).toBeInTheDocument();
  });

  it("shows error message when createLessonDownloadLink throws", async () => {
    mockCreateLessonDownloadLink.mockRejectedValue(new Error("API error"));

    renderWithTheme(<Page />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "There was an error preparing your download. Please try again.",
        ),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("shows error message when createLessonDownloadLink returns falsy", async () => {
    mockCreateLessonDownloadLink.mockResolvedValue(undefined);

    renderWithTheme(<Page />);

    await waitFor(() => {
      expect(
        screen.getByText("Could not generate download link. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("allows retry after error", async () => {
    mockCreateLessonDownloadLink.mockRejectedValueOnce(new Error("API error"));
    mockCreateLessonDownloadLink.mockResolvedValueOnce(
      "https://signed-url.com",
    );
    const user = userEvent.setup();

    renderWithTheme(<Page />);

    await waitFor(() => {
      expect(screen.getByText("Try again")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Try again"));

    await waitFor(() => {
      expect(
        screen.getByText("Your download has started."),
      ).toBeInTheDocument();
    });

    expect(createLessonDownloadLink).toHaveBeenCalledTimes(2);
  });
});
