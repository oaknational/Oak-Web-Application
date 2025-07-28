import React from "react";

import LessonOverviewFilesNeeded, {
  LessonOverviewFilesNeededProps,
} from "./LessonOverviewFilesNeeded";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";
import {
  defaultCopyrightRequirements,
  signedOutLoginRequired,
} from "@/__tests__/__helpers__/mockCopyrightRequirements";

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(),
}));

let mockCopyrightRequirements = defaultCopyrightRequirements;
jest.mock("@/hooks/useCopyrightRequirements", () => ({
  useCopyrightRequirements: () => mockCopyrightRequirements,
}));

jest.mock("next/router", () => require("next-router-mock"));
describe("LessonOverviewFilesNeeded", () => {
  const defaultProps: LessonOverviewFilesNeededProps = {
    loginRequired: false,
    geoRestricted: false,
    additionalFiles: [],
    slugs: {
      lessonSlug: "lesson-slug",
      unitSlug: "unit-slug",
      programmeSlug: "programme-slug",
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with multiple files", () => {
    const additionalFiles = ["file1.pdf", "file2.pdf"];
    const { getByText } = renderWithTheme(
      <LessonOverviewFilesNeeded
        {...defaultProps}
        additionalFiles={additionalFiles}
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
        {...defaultProps}
        additionalFiles={additionalFiles}
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
        {...defaultProps}
        additionalFiles={additionalFiles}
      />,
    );
    const downloadButton = getByRole("link", {
      name: /Download lesson file/i,
    });
    expect(downloadButton).toHaveAttribute("href", "/mock-url");
  });

  it("renders a sign up button when downloads are restricted", () => {
    mockCopyrightRequirements = signedOutLoginRequired;
    const additionalFiles = ["file1.pdf"];
    (resolveOakHref as jest.Mock).mockReturnValue("/mock-url");
    const { getByText } = renderWithTheme(
      <LessonOverviewFilesNeeded
        {...defaultProps}
        loginRequired={true}
        additionalFiles={additionalFiles}
      />,
    );

    const downloadButton = getByText(/Download lesson file/i).closest("button");

    expect(downloadButton).not.toHaveAttribute("href", "/mock-url");
  });
});
