import React from "react";
import { screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

import DownloadCardGroup, { DownloadCardGroupProps } from "./DownloadCardGroup";

import type { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import lessonDownloadsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const ComponentWrapper = (props: {
  downloads: DownloadCardGroupProps["downloads"];
  hasError?: boolean;
}) => {
  const { control, trigger } = useForm<ResourceFormValues>();

  return (
    <DownloadCardGroup {...props} control={control} triggerForm={trigger} />
  );
};

describe("DownloadCardGroup", () => {
  it("should render", () => {
    renderWithTheme(
      <ComponentWrapper downloads={lessonDownloadsFixtures().downloads} />,
    );

    expect(screen.getByText("Exit quiz questions")).toBeInTheDocument();
    expect(screen.getByText("Exit quiz answers")).toBeInTheDocument();
  });

  it("renders the lesson guide group first with PDF and DOCX options", () => {
    const { container } = renderWithTheme(
      <ComponentWrapper
        downloads={[
          {
            exists: true,
            type: "presentation",
            ext: "pptx",
            label: "Slide deck",
          },
          {
            exists: true,
            type: "lesson-guide-pdf",
            ext: "pdf",
            label: "Lesson guide",
          },
          {
            exists: true,
            type: "lesson-guide-docx",
            ext: "docx",
            label: "Lesson guide",
          },
        ]}
      />,
    );

    const legends = Array.from(container.querySelectorAll("legend")).map(
      (legend) => legend.textContent,
    );
    expect(legends).toEqual(["Lesson guide", "Slide deck"]);

    expect(screen.getByText("(PDF)")).toBeInTheDocument();
    expect(screen.getByText("(DOCX)")).toBeInTheDocument();
  });

  it("handles no downloads gracefully", () => {
    renderWithTheme(<ComponentWrapper downloads={[]} />);

    expect(screen.queryByText("Exit quiz questions")).not.toBeInTheDocument();
    expect(screen.queryByText("Exit quiz answers")).not.toBeInTheDocument();
    expect(screen.queryByText("Presentation")).not.toBeInTheDocument();
  });
});
