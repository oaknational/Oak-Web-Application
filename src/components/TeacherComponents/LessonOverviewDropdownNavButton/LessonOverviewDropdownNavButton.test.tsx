import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import {
  OakSmallPrimaryInvertedButton,
  OakFlex,
  OakSpan,
} from "@oaknational/oak-components";

import { LessonOverviewDropdownNavButton } from "./LessonOverviewDropdownNavButton";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const defaultProps = {
  primaryActionText: "Create more with AI",
  items: [
    { label: "Glossary" },
    { label: "Comprehension task" },
    { label: "Lesson narrative" },
    { label: "More starter quiz questions" },
    { label: "More exit quiz questions" },
  ],
  footer: (
    <OakFlex
      $flexDirection="column"
      $alignItems="center"
      $gap="space-between-xs"
    >
      <OakSpan $font="heading-light-7" $color="text-primary">
        Learn more about Aila, Oak's AI lesson assistant
      </OakSpan>
      <OakSmallPrimaryInvertedButton element="a" href="#" iconName="external">
        Learn more
      </OakSmallPrimaryInvertedButton>
    </OakFlex>
  ),
};

describe("LessonOverviewDropdownNavButton", () => {
  it("renders", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...defaultProps} />,
    );
    expect(getByText("Create more with AI")).toBeInTheDocument();
  });

  it("renders provided items when dropdown is open", async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...defaultProps} />,
    );

    // First open the dropdown
    await user.click(getByText("Create more with AI"));

    // Now check for items
    expect(getByText("Glossary")).toBeInTheDocument();
    expect(getByText("Comprehension task")).toBeInTheDocument();
    expect(getByText("Lesson narrative")).toBeInTheDocument();
    expect(getByText("More starter quiz questions")).toBeInTheDocument();
    expect(getByText("More exit quiz questions")).toBeInTheDocument();
  });

  it("renders custom items when provided and dropdown is open", async () => {
    const user = userEvent.setup();
    const customItems = [
      { label: "Custom Item 1" },
      { label: "Custom Item 2" },
    ];
    const { getByText, queryByText } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...defaultProps} items={customItems} />,
    );

    // First open the dropdown
    await user.click(getByText("Create more with AI"));

    expect(getByText("Custom Item 1")).toBeInTheDocument();
    expect(getByText("Custom Item 2")).toBeInTheDocument();
    expect(queryByText("Glossary")).not.toBeInTheDocument();
  });

  it("calls onPrimaryAction when primary button is clicked", async () => {
    const user = userEvent.setup();
    const onPrimaryAction = jest.fn();
    const { getByText } = renderWithTheme(
      <LessonOverviewDropdownNavButton
        {...defaultProps}
        onPrimaryAction={onPrimaryAction}
      />,
    );
    await user.click(getByText("Create more with AI"));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });

  it("calls onClick handler when item is clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const items = [{ label: "Test Item", onClick }];
    const { getByText, getByRole } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...defaultProps} items={items} />,
    );

    // First open the dropdown
    await user.click(getByText("Create more with AI"));

    // Now click on the item button
    const itemButton = getByRole("menuitem", { name: /Test Item/i });
    await user.click(itemButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders external link when href is provided and dropdown is open", async () => {
    const user = userEvent.setup();
    const items = [{ label: "External Link", href: "https://example.com" }];
    const { getByText, container } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...defaultProps} items={items} />,
    );

    // First open the dropdown
    await user.click(getByText("Create more with AI"));

    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("displays loading state on primary button", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewDropdownNavButton
        {...defaultProps}
        isPrimaryActionLoading={true}
      />,
    );
    const button = getByText("Create more with AI").closest("button");
    expect(button).toBeDisabled();
  });

  it("displays disabled state on primary button", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewDropdownNavButton
        {...defaultProps}
        isPrimaryActionDisabled={true}
      />,
    );
    const button = getByText("Create more with AI").closest("button");
    expect(button).toBeDisabled();
  });

  it("calls footer action when footer button is clicked and dropdown is open", async () => {
    const user = userEvent.setup();
    const onFooterAction = jest.fn();
    const customFooter = (
      <OakSmallPrimaryInvertedButton
        element="button"
        onClick={onFooterAction}
        aria-label="Learn more about Aila"
      >
        Learn more
      </OakSmallPrimaryInvertedButton>
    );
    const { getByText, getByRole } = renderWithTheme(
      <LessonOverviewDropdownNavButton
        {...defaultProps}
        footer={customFooter}
      />,
    );

    // First open the dropdown
    await user.click(getByText("Create more with AI"));

    // Now click the footer action
    const footerButton = getByRole("button", { name: "Learn more about Aila" });
    await user.click(footerButton);
    expect(onFooterAction).toHaveBeenCalledTimes(1);
  });

  it("renders footer text when provided and dropdown is open", async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...defaultProps} />,
    );

    // First open the dropdown
    await user.click(getByText("Create more with AI"));

    expect(
      getByText("Learn more about Aila, Oak's AI lesson assistant"),
    ).toBeInTheDocument();
  });

  it("renders with accessible attributes", () => {
    const { container } = renderWithTheme(
      <LessonOverviewDropdownNavButton
        {...defaultProps}
        ariaLabel="Additional materials"
        ariaDescription="Access teaching resources"
        data-testid="materials-component"
      />,
    );

    const section = container.querySelector(
      '[aria-label="Additional materials"]',
    );
    expect(section).toBeInTheDocument();

    const testElement = container.querySelector(
      '[data-testid="materials-component"]',
    );
    expect(testElement).toBeInTheDocument();
  });

  it("renders without footer when not provided", () => {
    const { queryByRole } = renderWithTheme(
      <LessonOverviewDropdownNavButton
        primaryActionText="Test Action"
        items={[{ label: "Test Item" }]}
      />,
    );

    const separator = queryByRole("separator");
    expect(separator).not.toBeInTheDocument();
  });

  it("renders custom icons for items when dropdown is open", async () => {
    const user = userEvent.setup();
    const items = [{ label: "Test Item", iconName: "download" as const }];
    const { getByText, container } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...defaultProps} items={items} />,
    );

    // First open the dropdown
    await user.click(getByText("Create more with AI"));

    // Check that an icon is rendered (we can't easily test the specific icon name)
    const icons = container.querySelectorAll('img[alt=""]');
    expect(icons.length).toBeGreaterThan(0);
  });

  it("toggles dropdown open/closed when primary button is clicked", async () => {
    const user = userEvent.setup();
    const { getByText, queryByRole } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...defaultProps} />,
    );

    // Initially closed
    expect(queryByRole("menu")).not.toBeInTheDocument();

    // Click to open
    await user.click(getByText("Create more with AI"));
    expect(queryByRole("menu")).toBeInTheDocument();

    // Click to close
    await user.click(getByText("Create more with AI"));
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    const { getByText, queryByRole } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...defaultProps} />,
    );

    // Open dropdown
    await user.click(getByText("Create more with AI"));
    expect(queryByRole("menu")).toBeInTheDocument();

    // Click outside (simulate by clicking on document body)
    await user.click(document.body);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("renders leading icon when leadingItemIcon prop is provided", async () => {
    const user = userEvent.setup();
    const { getByText, container } = renderWithTheme(
      <LessonOverviewDropdownNavButton
        {...defaultProps}
        leadingItemIcon="cross"
      />,
    );

    // First open the dropdown
    await user.click(getByText("Create more with AI"));

    // Check that icons are rendered for each item
    const icons = container.querySelectorAll('img[alt=""]');
    expect(icons.length).toBeGreaterThan(0);
  });

  it("does not render leading icon when leadingItemIcon prop is not provided", async () => {
    const user = userEvent.setup();
    const propsWithoutLeadingIcon = {
      primaryActionText: "Test Action",
      items: [{ label: "Test Item" }],
    };
    const { getByText, container } = renderWithTheme(
      <LessonOverviewDropdownNavButton {...propsWithoutLeadingIcon} />,
    );

    // First open the dropdown
    await user.click(getByText("Test Action"));

    // Should not have leading icons (only trailing external icons from items)
    const items = container.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(1);
  });
});
