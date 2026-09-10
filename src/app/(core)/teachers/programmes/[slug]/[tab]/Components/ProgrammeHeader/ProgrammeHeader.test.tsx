import React from "react";
import "@testing-library/jest-dom";

import { subjectHeroImages } from "./getSubjectHeroImageUrl";
import { ProgrammeHeader } from "./ProgrammeHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const baseProps = {
  subject: "music" as const,
  heading: "Science secondary",
  summary: "Test content for the programme header.",
  bullets: ["Bullet 1", "Bullet 2"],
  layoutVariant: "large" as const,
};

describe("ProgrammeHeader", () => {
  describe("subject illustration image", () => {
    it("renders presentational image with correct src URL", () => {
      const { getByTestId } = renderWithTheme(
        <ProgrammeHeader {...baseProps} />,
      );
      const imageContainer = getByTestId("hero-image");
      const subjectHeroImage = imageContainer.querySelector("img");

      expect(subjectHeroImage).toBeInTheDocument();
      expect(subjectHeroImage?.getAttribute("src")).toContain(
        subjectHeroImages.music,
      );
    });
  });

  describe("heading", () => {
    it("renders the provided heading", () => {
      const { getByRole } = renderWithTheme(<ProgrammeHeader {...baseProps} />);

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "Science secondary",
      );
    });

    it("renders provided heading for year copy", () => {
      const { getByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} heading="Science year 9" />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "Science year 9",
      );
    });

    it("renders provided heading for primary copy", () => {
      const { getByRole } = renderWithTheme(
        <ProgrammeHeader {...baseProps} heading="English primary" />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "English primary",
      );
    });
  });
});
