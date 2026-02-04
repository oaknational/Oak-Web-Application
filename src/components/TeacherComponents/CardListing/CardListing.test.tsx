import { screen } from "@testing-library/dom";

import CardListing from "./CardListing";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const defaultProps = {
  index: 158,
  title: "Card title",
  layoutVariant: "horizontal" as const,
  isHighlighted: false,
  href: "testUrl",
};

const saveProps = {
  unitSlug: "unit-slug",
  unitTitle: "Unit title",
  programmeSlug: "programme-slug",
  trackingProps: {
    savedFrom: "unit_listing_save_button" as const,
    keyStageSlug: "ks1" as const,
    keyStageTitle: "Key stage 1" as const,
    subjectSlug: "maths",
    subjectTitle: "Maths",
  },
};

describe("CardListing", () => {
  it("renders a title and an index", () => {
    render(<CardListing {...defaultProps} />);

    const title = screen.getByText("Card title");
    const index = screen.getByText("158");

    expect(title).toBeInTheDocument();
    expect(index).toBeInTheDocument();
  });
  it("renders a link", () => {
    render(<CardListing {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toBeDefined();
    expect(link).toHaveProperty("href", "http://localhost/testUrl");
  });
  it("should render a subheading when passed in", () => {
    const subheading = "This is subcopy";
    render(<CardListing {...defaultProps} subcopy={subheading} />);

    const subcopy = screen.getByText(subheading);
    expect(subcopy).toBeInTheDocument();
  });
  it("should render tags when passed in", () => {
    render(
      <CardListing
        {...defaultProps}
        tags={[
          { label: "Tag without icon" },
          { label: "Tag with icon", icon: "books" },
        ]}
      />,
    );

    const tagWithoutIcon = screen.getByText("Tag without icon");
    const tagWithIcon = screen.getByText("Tag with icon");

    expect(tagWithoutIcon).toBeInTheDocument();
    expect(tagWithIcon).toBeInTheDocument();
  });
  it("should render a lesson count when passed in", () => {
    render(<CardListing {...defaultProps} lessonCount={189} />);

    const lessonCount = screen.getByText("189 lessons");
    expect(lessonCount).toBeInTheDocument();
  });
  it("should render a lesson count of 1 with the correct pluralisation", () => {
    render(<CardListing {...defaultProps} lessonCount={1} />);

    const lessonCount = screen.getByText("1 lesson");
    expect(lessonCount).toBeInTheDocument();
  });
  it("should render a save button when passed in", () => {
    render(<CardListing {...defaultProps} saveProps={saveProps} />);

    const saveButton = screen.getByRole("button", {
      name: "Save this unit: Unit title",
    });
    expect(saveButton).toBeInTheDocument();
  });
  it("should not render a link in a disabled state", () => {
    render(<CardListing {...defaultProps} disabled />);

    const link = screen.queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });
  it("should disable the save button in a disabled state", () => {
    render(<CardListing {...defaultProps} saveProps={saveProps} disabled />);

    const saveButton = screen.getByRole("button", {
      name: "Save this unit: Unit title",
    });
    expect(saveButton).toBeDisabled();
  });
});
