import { screen } from "@testing-library/react";

import { TeachWithOakPromoSection } from "./TeachWithOakPromoSection";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("TeachWithOakPromoSection", () => {
  it("renders correctly", () => {
    const { container, getByText } = render(<TeachWithOakPromoSection />);
    expect(container).toMatchSnapshot();
    const heading = screen.getByRole("heading", {
      level: 3,
      name: "Ever wondered why our lessons are structured this way?",
    });

    expect(heading).toBeInTheDocument();

    expect(
      getByText("Ever wondered why our lessons are structured this way?"),
    ).toBeInTheDocument();
    expect(
      getByText(
        "See how explanation, checks for understanding, practice and feedback work together to support pupils' learning.",
      ),
    ).toBeInTheDocument();
    expect(getByText("See the thinking")).toBeInTheDocument();
  });

  it("renders link pointing to the correct href", () => {
    render(<TeachWithOakPromoSection />);

    const link = screen.getByRole("link", { name: /See the thinking/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/teachers/teach-with-oak");
  });
});
