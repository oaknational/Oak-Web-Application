import React from "react";
import "@testing-library/jest-dom";

import { ProgrammeHeader } from "./ProgrammeHeader";
import { subjectHeroImages } from "./getSubjectHeroImageUrl";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const baseProps = {
  subject: "music" as const,
  subjectTitle: "Science",
  phaseTitle: "Secondary",
  summary: "Test content for the programme header.",
  bullets: ["Bullet 1", "Bullet 2"],
};

describe("ProgrammeHeader", () => {
  describe("subject illustration image", () => {
    it("renders presentational image with correct src URL", () => {
      const { getByTestId } = renderWithTheme(
        <ProgrammeHeader {...baseProps} />,
      );
      const imageContainer = getByTestId("subject-hero-image");
      const subjectHeroImage = imageContainer.querySelector("img");

      expect(subjectHeroImage).toBeInTheDocument();
      expect(subjectHeroImage?.getAttribute("src")).toContain(
        subjectHeroImages.music,
      );
    });
  });

  describe("heading", () => {
    it("renders heading with subjectTitle and phaseTitle when schoolYear is not provided", () => {
      const { getByRole } = renderWithTheme(<ProgrammeHeader {...baseProps} />);

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "Science secondary",
      );
    });

    it("renders heading with subjectTitle and schoolYear when schoolYear is provided", () => {
      const { getByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} schoolYear="9" />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "Science year 9",
      );
    });

    it("renders heading with Primary phase title correctly", () => {
      const { getByRole } = renderWithTheme(
        <ProgrammeHeader
          {...baseProps}
          subjectTitle="English"
          phaseTitle="Primary"
        />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "English primary",
      );
    });
  });

  it("renders summary text", () => {
    const { getByText } = renderWithTheme(<ProgrammeHeader {...baseProps} />);

    expect(
      getByText("Test content for the programme header."),
    ).toBeInTheDocument();
  });

  describe("bullets rendering", () => {
    it("renders all bullet points", () => {
      const { getAllByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} />,
      );
      const listItems = getAllByRole("listitem");

      expect(listItems).toHaveLength(2);
      expect(listItems[0]).toHaveTextContent("Bullet 1");
      expect(listItems[1]).toHaveTextContent("Bullet 2");
    });

    it("renders bullets as list items", () => {
      const { getAllByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} />,
      );

      const listItems = getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("does not render bullets list when bullets array is empty", () => {
      const { queryByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} bullets={[]} />,
      );
      const list = queryByRole("list");

      expect(list).not.toBeInTheDocument();
    });

    it("does not render bullets list when bullets prop is undefined", () => {
      const { queryByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} bullets={undefined} />,
      );
      const list = queryByRole("list");

      expect(list).not.toBeInTheDocument();
    });
  });

  describe("slots rendering", () => {
    it("renders header slot content when provided", () => {
      const headerContent = "Breadcrumb navigation";
      const { getByText } = renderWithTheme(
        <ProgrammeHeader {...baseProps} headerSlot={headerContent} />,
      );

      expect(getByText(headerContent)).toBeInTheDocument();
    });

    it("renders footer slot content when provided", () => {
      const footerContent = "Action buttons";
      const { getByText } = renderWithTheme(
        <ProgrammeHeader {...baseProps} footerSlot={footerContent} />,
      );

      expect(getByText(footerContent)).toBeInTheDocument();
    });
  });
});
