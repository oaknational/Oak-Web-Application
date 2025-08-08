import userEvent from "@testing-library/user-event";

import ResourceCard from "./ResourceCard";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("ResourceCard", () => {
  it("renders a checkbox with an icon, title and resource file type", () => {
    const { getByText, getByRole } = renderWithTheme(
      <ResourceCard
        id="unique-123"
        name="downloadResources"
        label="Worksheet"
        subtitle="PDF"
        checked
        onChange={jest.fn()}
        resourceType="worksheet-pdf"
      />,
    );

    const input = getByRole("checkbox");

    expect(input).toBeInTheDocument();
    expect(getByText("Worksheet")).toBeInTheDocument();
    expect(getByText("PDF")).toBeInTheDocument();
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
      />,
    );

    expect(getByText("Editable")).toBeInTheDocument();
  });
});
