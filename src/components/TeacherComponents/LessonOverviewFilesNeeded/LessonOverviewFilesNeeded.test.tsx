import React from "react";

import LessonOverviewFilesNeeded from "./LessonOverviewFilesNeeded";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(),
}));

const mockUseCopyrightRequirements = {
  showSignedOutGeoRestricted: false,
  showSignedOutLoginRequired: false,
};
jest.mock("@/hooks/useCopyrightRequirements", () => ({
  useCopyrightRequirements: () => mockUseCopyrightRequirements,
}));

jest.mock("next/router", () => require("next-router-mock"));

describe("LessonOverviewFilesNeeded", () => {
  const slugs = {
    lessonSlug: "lesson-slug",
    unitSlug: "unit-slug",
    programmeSlug: "programme-slug",
  };

  afterEach(() => {
    jest.clearAllMocks();
    mockUseCopyrightRequirements.showSignedOutGeoRestricted = false;
    mockUseCopyrightRequirements.showSignedOutLoginRequired = false;
  });

  it("renders correctly with multiple files", () => {
    const additionalFiles = ["file1.pdf", "file2.pdf"];
    const { getByText } = renderWithTheme(
      <LessonOverviewFilesNeeded
        geoRestricted={false}
        loginRequired={false}
        additionalFiles={additionalFiles}
        slugs={slugs}
      />,
    );
    expect(getByText("Files needed for this lesson")).toBeInTheDocument();
    expect(getByText("file1.pdf")).toBeInTheDocument();
    expect(getByText("file2.pdf")).toBeInTheDocument();
    expect(
      getByText("Download these files to use in the lesson."),
    ).toBeInTheDocument();
    expect(getByText("Download lesson files")).toBeInTheDocument();
  });

  it("renders correctly with a single file", () => {
    const additionalFiles = ["file1.pdf"];
    const { getByText } = renderWithTheme(
      <LessonOverviewFilesNeeded
        geoRestricted={false}
        loginRequired={false}
        additionalFiles={additionalFiles}
        slugs={slugs}
      />,
    );
    expect(getByText("File needed for this lesson")).toBeInTheDocument();
    expect(getByText("file1.pdf")).toBeInTheDocument();
    expect(
      getByText("Download this file to use in the lesson."),
    ).toBeInTheDocument();
    expect(getByText("Download lesson file")).toBeInTheDocument();
  });

  it("download button has correct href", () => {
    const additionalFiles = ["file1.pdf"];
    (resolveOakHref as jest.Mock).mockReturnValue("/mock-url");
    const { getByRole } = renderWithTheme(
      <LessonOverviewFilesNeeded
        geoRestricted={false}
        loginRequired={false}
        additionalFiles={additionalFiles}
        slugs={slugs}
      />,
    );
    const downloadButton = getByRole("link", {
      name: /Download lesson file/i,
    });
    expect(downloadButton).toHaveAttribute("href", "/mock-url");
  });

  it("renders a sign up button when downloads are restricted", () => {
    mockUseCopyrightRequirements.showSignedOutGeoRestricted = true;
    mockUseCopyrightRequirements.showSignedOutLoginRequired = true;
    const additionalFiles = ["file1.pdf"];
    const { queryByRole, getByTestId } = renderWithTheme(
      <LessonOverviewFilesNeeded
        geoRestricted={true}
        loginRequired={true}
        additionalFiles={additionalFiles}
        slugs={slugs}
      />,
    );
    expect(
      queryByRole("link", { name: /Download lesson file/i }),
    ).not.toBeInTheDocument();
    expect(getByTestId("sign-up-button")).toBeInTheDocument();
  });
});
