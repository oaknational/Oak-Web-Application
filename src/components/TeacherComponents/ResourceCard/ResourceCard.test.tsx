import userEvent from "@testing-library/user-event";

import ResourceCard from "./ResourceCard";

import { SHARE_FORM_ERROR_IDS } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/shareDownloadFormErrorIds";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("ResourceCard", () => {
  it.each([
    { type: "worksheet-pdf", label: "Worksheet", ext: "PDF" },
    { type: "lesson-guide-docx", label: "Lesson guide", ext: "DOCX" },
  ] as const)("renders a checkbox for $type", ({ type, label, ext }) => {
    const { getByText, getByRole } = renderWithTheme(
      <ResourceCard
        id="unique-123"
        name="downloadResources"
        label={label}
        subtitle={ext}
        checked
        onChange={jest.fn()}
        resourceType={type}
        useDownloadPageLayout
      />,
    );

    const input = getByRole("checkbox");

    expect(input).toBeInTheDocument();
    expect(getByText(label)).toBeInTheDocument();
    expect(getByText(ext)).toBeInTheDocument();
  });

  it("changes on click on label", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender, getByRole, getByText } = renderWithTheme(
      <ResourceCard
        id="unique-123"
        checked={value}
        name="downloadResources"
        label="Worksheet"
        subtitle="PDF"
        onChange={() => toggleValue()}
        resourceType="worksheet-pdf"
        useDownloadPageLayout
      />,
    );

    const user = userEvent.setup();

    const input = getByRole("checkbox");
    expect(input).not.toBeChecked();

    const label = getByText("Worksheet");
    await user.click(label);

    rerender(
      <ResourceCard
        id="unique-123"
        checked={value}
        name="downloadResources"
        label="Worksheet"
        subtitle="PDF"
        onChange={() => toggleValue()}
        resourceType="worksheet-pdf"
        useDownloadPageLayout
      />,
    );

    expect(input).toBeChecked();
  });

  it("renders isEditable tag correctly", () => {
    const { getByText } = renderWithTheme(
      <ResourceCard
        id="unique-123"
        name="downloadResources"
        label="Worksheet"
        subtitle="PDF"
        checked
        onChange={jest.fn()}
        resourceType="worksheet-pdf"
        isEditable={true}
        useDownloadPageLayout
      />,
    );

    expect(getByText("Editable")).toBeInTheDocument();
  });

  it("links resource selection errors to the download checkbox", () => {
    const { getByRole } = renderWithTheme(
      <ResourceCard
        id="unique-123"
        name="downloadResources"
        label="Worksheet"
        subtitle="PDF"
        checked={false}
        onChange={jest.fn()}
        resourceType="worksheet-pdf"
        useDownloadPageLayout
        hasError
      />,
    );

    const input = getByRole("checkbox");
    expect(input).toHaveAttribute(
      "aria-describedby",
      SHARE_FORM_ERROR_IDS.resources,
    );
    expect(input).not.toHaveAttribute("aria-invalid");
  });
});
