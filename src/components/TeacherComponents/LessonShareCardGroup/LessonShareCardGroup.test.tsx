import { screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";

import {
  ResourceFormProps,
  ResourceFormWithRiskAssessmentProps,
} from "../types/downloadAndShare.types";

import LessonShareCardGroup from "./LessonShareCardGroup";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";

const ComponentWrapper = (props: {
  shareableResources: LessonShareData["shareableResources"];
  shareLink: string;
}) => {
  const { control, trigger } = useForm<
    ResourceFormProps | ResourceFormWithRiskAssessmentProps
  >();

  return (
    <LessonShareCardGroup
      {...props}
      control={control}
      triggerForm={trigger}
      shareableResources={props.shareableResources}
      shareLink={props.shareLink}
      hideCheckboxes={false}
    />
  );
};

describe("lesson share card group", () => {
  it("should render", () => {
    renderWithTheme(
      <ComponentWrapper shareableResources={[]} shareLink="www.fake.com" />,
    );

    const previewButton = screen.getByText("Preview as a pupil");
    expect(previewButton).toBeInTheDocument();
  });
  it("should render with resources", () => {
    const shareableResources = [
      {
        exists: true,
        type: "video" as const,
        metadata: "5min",
        label: "Video",
      },
    ];
    renderWithTheme(
      <ComponentWrapper
        shareableResources={shareableResources}
        shareLink="www.fake.com"
      />,
    );

    const resourceCardLabel = screen.getByText("Video");
    expect(resourceCardLabel).toBeInTheDocument();
  });
  it("should toggle the checkbox when clicked", async () => {
    const shareableResources = [
      {
        exists: true,
        type: "video" as const,
        metadata: "5min",
        label: "Video",
      },
    ];
    renderWithTheme(
      <ComponentWrapper
        shareableResources={shareableResources}
        shareLink="www.fake.com"
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const user = userEvent.setup();
    const checkboxLabel = screen.getByText("Video");
    await user.click(checkboxLabel);
    expect(checkbox).toBeChecked();

    await user.click(checkboxLabel);
    expect(checkbox).not.toBeChecked();
  });
  it("should render pdf label in uppercase", () => {
    const shareableResources = [
      {
        exists: true,
        type: "worksheet-pdf" as const,
        metadata: "pdf",
        label: "Worksheet",
      },
    ];
    renderWithTheme(
      <ComponentWrapper
        shareableResources={shareableResources}
        shareLink="www.fake.com"
      />,
    );

    const resourceCardLabel = screen.getByText("PDF");
    expect(resourceCardLabel).toBeInTheDocument();
  });
});
