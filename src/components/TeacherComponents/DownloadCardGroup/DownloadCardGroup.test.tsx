import React from "react";
import { screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

import DownloadCardGroup, {
  DownloadCardGroupProps,
  getGridArea,
} from "./DownloadCardGroup";

import type {
  ResourceFormProps,
  ResourceFormWithRiskAssessmentProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import lessonDownloadsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const ComponentWrapper = (props: {
  downloads: DownloadCardGroupProps["downloads"];
  hasError?: boolean;
}) => {
  const { control, trigger } = useForm<
    ResourceFormProps | ResourceFormWithRiskAssessmentProps
  >();

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

  it("handles no downloads gracefully", () => {
    renderWithTheme(<ComponentWrapper downloads={[]} />);

    expect(screen.queryByText("Exit quiz questions")).not.toBeInTheDocument();
    expect(screen.queryByText("Exit quiz answers")).not.toBeInTheDocument();
    expect(screen.queryByText("Presentation")).not.toBeInTheDocument();
  });
});

describe("getGridArea", () => {
  it('returns "lesson-guide-pdf" for lesson-guide-pdf type', () => {
    const result = getGridArea("lesson-guide-pdf", true);
    expect(result).toBe("lesson-guide-pdf");
  });

  it('returns "auto" for curriculum-pdf type', () => {
    const result = getGridArea("curriculum-pdf", true);
    expect(result).toBe("auto");
  });

  it("returns the type if there are 2 worksheets or no presentation", () => {
    const result1 = getGridArea("worksheet-pdf", true, 2);
    expect(result1).toBe("worksheet-pdf");

    const result2 = getGridArea("worksheet-pptx", false);
    expect(result2).toBe("worksheet-pptx");
  });

  it('returns "presentationOrWorksheet" by default', () => {
    const result = getGridArea("worksheet-pdf", true, 1);
    expect(result).toBe("presentationOrWorksheet");
  });
});
