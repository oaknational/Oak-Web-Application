import React from "react";
import { screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

import DownloadCardGroup, { DownloadCardGroupProps } from "./DownloadCardGroup";

import type { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import lessonDownloadsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const ComponentWrapper = (props: {
  downloads: DownloadCardGroupProps["downloads"];
  hasError?: boolean;
}) => {
  const { control, trigger } = useForm<ResourceFormProps>();

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
