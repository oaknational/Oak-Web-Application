import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import DownloadCard from "./DownloadCard";

describe("DownloadCard", () => {
  it("renders a checkbox with an icon, title and resource file type", () => {
    renderWithTheme(
      <DownloadCard
        id="unique-123"
        name="downloadResources"
        checked
        onChange={jest.fn()}
        resourceType="worksheet"
      />
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
      <DownloadCard
        id="unique-123"
        checked={value}
        name="downloadResources"
        onChange={() => toggleValue()}
        resourceType="worksheet"
      />
    );

    const user = userEvent.setup();

    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();

    const label = screen.getByText("Worksheet");
    await user.click(label);

    rerender(
      <DownloadCard
        id="unique-123"
        checked={value}
        name="downloadResources"
        onChange={() => toggleValue()}
        resourceType="worksheet"
      />
    );

    expect(input).toBeChecked();
  });
});
