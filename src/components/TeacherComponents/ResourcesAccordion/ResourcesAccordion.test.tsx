import { fireEvent } from "@testing-library/react";

import ResourcesAccordion, {
  ResourcesAccordionProps,
} from "./ResourcesAccordion";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const mockHandleToggleSelectAll = jest.fn();

const defaultProps: ResourcesAccordionProps = {
  downloads: "3 downloads available",
  selectAllChecked: false,
  handleToggleSelectAll: mockHandleToggleSelectAll,
  cardGroup: <div>Mock card group content</div>,
} as unknown as ResourcesAccordionProps;

describe("ResourcesAccordion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with default props", () => {
    const { getByText, getByRole } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} />,
    );

    expect(getByText("Select all resources")).toBeInTheDocument();
    expect(getByText("3 downloads available")).toBeInTheDocument();
    expect(getByRole("checkbox")).toBeInTheDocument();
  });

  it("displays correct heading when selectAllChecked is true", () => {
    const { getByText } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} selectAllChecked={true} />,
    );

    expect(getByText("All resources selected")).toBeInTheDocument();
  });

  it("displays correct heading when selectAllChecked is false", () => {
    const { getByText } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} selectAllChecked={false} />,
    );

    expect(getByText("Select all resources")).toBeInTheDocument();
  });

  it("checkbox reflects the selectAllChecked prop", () => {
    const { getByRole, rerender } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} selectAllChecked={false} />,
    );

    const checkbox = getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    rerender(<ResourcesAccordion {...defaultProps} selectAllChecked={true} />);

    expect(checkbox).toBeChecked();
  });

  it("calls handleToggleSelectAll when checkbox area is clicked", () => {
    const { getByRole } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} />,
    );

    const checkbox = getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(mockHandleToggleSelectAll).toHaveBeenCalledTimes(1);
  });

  it("renders the accordion in closed state initially", () => {
    const { queryByText } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} />,
    );

    // The card group content should not be visible initially
    expect(queryByText("Mock card group content")).not.toBeVisible();
  });

  it("shows card group content when accordion is expanded", () => {
    const { getByText, getByRole } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} />,
    );

    // Find and click the accordion button to expand it
    const accordionButton = getByRole("button");
    fireEvent.click(accordionButton);

    // Now the card group content should be visible
    expect(getByText("Mock card group content")).toBeInTheDocument();
  });

  it("displays custom downloads text", () => {
    const customDownloads = "5 resources ready to download";
    const { getByText } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} downloads={customDownloads} />,
    );

    expect(getByText(customDownloads)).toBeVisible();
  });

  it("renders custom cardGroup content", () => {
    const customCardGroup = <div>Custom resource cards here</div>;
    const { getByText, getByRole } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} cardGroup={customCardGroup} />,
    );

    // Expand accordion to see content
    const accordionButton = getByRole("button");
    fireEvent.click(accordionButton);

    expect(getByText("Custom resource cards here")).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    const { getByRole } = renderWithTheme(
      <ResourcesAccordion {...defaultProps} />,
    );

    const checkbox = getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", "select-all");
    expect(checkbox).toHaveAttribute("name", "select-all");

    const accordionButton = getByRole("button");
    expect(accordionButton).toHaveAttribute("aria-expanded", "false");
  });
});
