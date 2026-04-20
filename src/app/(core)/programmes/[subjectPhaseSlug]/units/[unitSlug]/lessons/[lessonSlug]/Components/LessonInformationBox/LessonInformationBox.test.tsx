import { screen } from "@testing-library/dom";

import LessonInformationBox from "./LessonInformationBox";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const render = renderWithTheme;

describe("LessonInformationBox", () => {
  it("renders teacher tip", () => {
    render(
      <LessonInformationBox
        teacherTip={[
          "Allow pupils to sensibly and kindly trigger a reflex response to allow pupils to realise that the response happens before they know about it.",
        ]}
      />,
    );

    const teacherTipHeading = screen.getByRole("heading", {
      name: "Teacher tip",
    });
    const lessonInformationContainer = screen.getByTestId(
      "lesson-information-container",
    );
    const teacherTipText = screen.getByText(
      "Allow pupils to sensibly and kindly trigger a reflex response to allow pupils to realise that the response happens before they know about it.",
    );
    expect(teacherTipHeading).toBeInTheDocument();
    expect(teacherTipText).toBeInTheDocument();
    expect(lessonInformationContainer).toHaveStyle(
      "background: rgb(215, 241, 239)",
    );
  });

  it("renders equipment section", () => {
    render(
      <LessonInformationBox
        equipment={["Equipment item 1", "Equipment item 2"]}
      />,
    );
    const equipmentHeading = screen.getByRole("heading", {
      name: "Equipment",
    });
    const equipmentText = screen.getByText("Equipment item 1");
    const lessonInformationContainer = screen.getByTestId(
      "lesson-information-container",
    );
    expect(equipmentHeading).toBeInTheDocument();
    expect(equipmentText).toBeInTheDocument();
    expect(lessonInformationContainer).toHaveStyle("background: #f2f2f2");
  });

  it("renders content guidance section", () => {
    render(
      <LessonInformationBox
        contentGuidance={["Content guidance item 1", "Content guidance item 2"]}
      />,
    );
    const contentGuidanceHeading = screen.getByRole("heading", {
      name: "Content guidance",
    });
    const contentGuidanceText = screen.getByText("Content guidance item 1");
    const lessonInformationContainer = screen.getByTestId(
      "lesson-information-container",
    );
    expect(contentGuidanceHeading).toBeInTheDocument();
    expect(contentGuidanceText).toBeInTheDocument();
    expect(lessonInformationContainer).toHaveStyle("background: #f2f2f2");
  });

  it("renders supervision section", () => {
    render(
      <LessonInformationBox
        supervision={["Supervision item 1", "Supervision item 2"]}
      />,
    );
    const supervisionHeading = screen.getByRole("heading", {
      name: "Supervision",
    });
    const supervisionText = screen.getByText("Supervision item 1");
    const lessonInformationContainer = screen.getByTestId(
      "lesson-information-container",
    );
    expect(supervisionHeading).toBeInTheDocument();
    expect(supervisionText).toBeInTheDocument();
    expect(lessonInformationContainer).toHaveStyle("background: #f2f2f2");
  });

  it("renders files needed section", () => {
    render(
      <LessonInformationBox
        filesNeeded={{
          files: ["File 1", "File 2"],
          href: "#",
          geoRestricted: false,
          loginRequired: false,
        }}
      />,
    );

    const filesNeededHeading = screen.getByRole("heading", {
      name: "Files needed for this lesson",
    });
    const fileNeededText = screen.getByText("File 1");
    const lessonInformationContainer = screen.getByTestId(
      "lesson-information-container",
    );
    const downloadInstructionText = screen.getByText(
      "Download these files to use in the lesson.",
    );
    const buttonText = screen.getByRole("link", {
      name: "Download lesson files",
    });

    expect(filesNeededHeading).toBeInTheDocument();
    expect(fileNeededText).toBeInTheDocument();
    expect(downloadInstructionText).toBeInTheDocument();
    expect(buttonText).toBeInTheDocument();
    expect(lessonInformationContainer).toHaveStyle("background: #f2f2f2");
  });

  it("renders singular file text when only one file is needed", () => {
    render(
      <LessonInformationBox
        filesNeeded={{
          files: ["File 1"],
          href: "#",
          geoRestricted: false,
          loginRequired: false,
        }}
      />,
    );

    const filesNeededHeading = screen.getByRole("heading", {
      name: "File needed for this lesson",
    });
    const fileNeededText = screen.getByText("File 1");
    const downloadInstructionText = screen.getByText(
      "Download this file to use in the lesson.",
    );
    const buttonText = screen.getByRole("link", {
      name: "Download lesson file",
    });
    expect(filesNeededHeading).toBeInTheDocument();
    expect(fileNeededText).toBeInTheDocument();
    expect(downloadInstructionText).toBeInTheDocument();
    expect(buttonText).toBeInTheDocument();
  });

  it("links to the correct href for files needed", () => {
    render(
      <LessonInformationBox
        filesNeeded={{
          files: ["File 1"],
          href: "https://example.com/file1",
          geoRestricted: false,
          loginRequired: false,
        }}
      />,
    );

    const button = screen.getByRole("link", {
      name: "Download lesson file",
    });
    expect(button).toHaveAttribute("href", "https://example.com/file1");
  });

  it("does not render anything if no props are provided", () => {
    render(<LessonInformationBox />);

    const teacherTipHeading = screen.queryByRole("heading");
    expect(teacherTipHeading).not.toBeInTheDocument();
  });
});
