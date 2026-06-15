import { screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";

import { ResourceFormValues } from "../types/downloadAndShare.types";

import LessonShareCardGroup, {
  SHARE_SELECT_ACTIVITIES_HEADING_ID,
} from "./LessonShareCardGroup";

import { getActivityDownloadCardAriaLabel } from "@/components/TeacherComponents/ShareResourceCard/ShareResourceCard";
import { SHARE_FORM_ERROR_IDS } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/shareDownloadFormErrorIds";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";

const ComponentWrapper = (props: {
  shareableResources: LessonShareData["shareableResources"];
  shareLink: string;
  hasError?: boolean;
}) => {
  const { control, trigger } = useForm<ResourceFormValues>();

  return (
    <LessonShareCardGroup
      {...props}
      control={control}
      triggerForm={trigger}
      shareableResources={props.shareableResources}
      hideCheckboxes={false}
      hasError={props.hasError}
    />
  );
};

describe("lesson share card group", () => {
  it("should render", () => {
    renderWithTheme(
      <ComponentWrapper shareableResources={[]} shareLink="www.fake.com" />,
    );

    expect(
      screen.getByRole("heading", { name: /select activities/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Select activities" }),
    ).toBeInTheDocument();
    expect(
      document.getElementById(SHARE_SELECT_ACTIVITIES_HEADING_ID),
    ).toHaveTextContent("Select activities");
    const fieldset = screen.getByRole("group", { name: "Select activities" });
    expect(fieldset).toHaveAttribute(
      "aria-labelledby",
      SHARE_SELECT_ACTIVITIES_HEADING_ID,
    );
    expect(screen.getByText("Full online lesson")).toBeInTheDocument();

    const fullLessonCheckbox = screen.getByRole("checkbox", {
      name: /full online lesson/i,
    });
    expect(fullLessonCheckbox).toHaveAttribute(
      "aria-label",
      getActivityDownloadCardAriaLabel(
        "Full online lesson",
        "Share the whole lesson (starter quiz, lesson video, worksheet and exit quiz) and view results",
      ),
    );
    expect(fullLessonCheckbox).not.toHaveAttribute("title");
  });

  it("should toggle the full online lesson checkbox", async () => {
    renderWithTheme(
      <ComponentWrapper shareableResources={[]} shareLink="www.fake.com" />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /full online lesson/i,
    });
    const user = userEvent.setup();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
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
    const checkbox = screen.getByRole("checkbox", { name: "Video 5min" });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("aria-label", "Video 5min");
    expect(checkbox).not.toHaveAttribute("title");
    expect(checkbox).not.toBeChecked();

    const user = userEvent.setup();
    const checkboxLabel = screen.getByText("Video");
    await user.click(checkboxLabel);
    expect(checkbox).toBeChecked();

    await user.click(checkboxLabel);
    expect(checkbox).not.toBeChecked();
  });

  it("links resource selection errors to activity checkboxes", () => {
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
        hasError
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);

    for (const checkbox of checkboxes) {
      expect(checkbox).toHaveAttribute(
        "aria-describedby",
        SHARE_FORM_ERROR_IDS.resources,
      );
      expect(checkbox).not.toHaveAttribute("aria-invalid");
    }
  });
});
