import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ResourceCard from "./ResourceCard";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("ResourceCard", () => {
  it("renders a checkbox with an icon, title and resource file type", () => {
    renderWithTheme(
      <ResourceCard
        id="unique-123"
        name="downloadResources"
        label="Worksheet"
        ariaLabel="Worksheet"
        subtitle="PDF"
        checked
        onChange={jest.fn()}
        resourceType="worksheet-pdf"
      />,
    );

    const input = screen.getByRole("checkbox");

    expect(input).toBeInTheDocument();
    expect(screen.getByText("Worksheet")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  it("changes on click on label", async () => {
    let value = false;

    const toggleValue = () => {
      value = !value;
    };

    const { rerender } = renderWithTheme(
      <ResourceCard
        id="unique-123"
        checked={value}
        name="downloadResources"
        label="Worksheet"
        ariaLabel="Worksheet"
        subtitle="PDF"
        onChange={() => toggleValue()}
        resourceType="worksheet-pdf"
      />,
    );

    const user = userEvent.setup();

    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    const label = screen.getByText("Worksheet");
    await user.click(label);

    rerender(
      <ResourceCard
        id="unique-123"
        checked={value}
        name="downloadResources"
        label="Worksheet"
        ariaLabel="Worksheet"
        subtitle="PDF"
        onChange={() => toggleValue()}
        resourceType="worksheet-pdf"
      />,
    );

    expect(input).toBeChecked();
  });

  it("does not render a checkbox when showCheckbox is false", () => {
    renderWithTheme(
      <ResourceCard
        id="unique-123"
        name="downloadResources"
        label="Worksheet"
        ariaLabel="Worksheet"
        subtitle="PDF"
        checked
        onChange={jest.fn()}
        resourceType="worksheet-pdf"
        hideCheckbox={true}
      />,
    );

    const input = screen.queryByRole("checkbox");

    expect(input).not.toBeInTheDocument();
    expect(screen.getByText("Worksheet")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  it;
});
